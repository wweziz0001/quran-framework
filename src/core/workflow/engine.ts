/**
 * Workflow Core - State Machine
 * ==============================
 * Odoo-like workflow engine with state transitions
 */

// State definition
export interface StateDefinition {
  name: string;
  label: string;
  color?: string;
  onEnter?: string;    // Method name
  onExit?: string;     // Method name
}

// Transition definition
export interface TransitionDefinition {
  name: string;
  from: string | string[];
  to: string;
  trigger: string;     // Action name
  condition?: string;  // Method name
  action?: string;     // Method name
  button?: TransitionButton;
}

// Transition button
export interface TransitionButton {
  label: string;
  icon?: string;
  confirm?: string;
  groups?: string[];
  class?: string;
}

// Workflow definition
export interface WorkflowDefinition {
  model: string;
  field: string;       // Field name for state
  states: StateDefinition[];
  transitions: TransitionDefinition[];
  initial: string;
}

// Workflow Engine
export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private workflows: Map<string, WorkflowDefinition> = new Map();
  
  private constructor() {}
  
  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }
  
  // Register a workflow
  register(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.model, workflow);
  }
  
  // Get workflow for model
  get(model: string): WorkflowDefinition | undefined {
    return this.workflows.get(model);
  }
  
  // Get current state
  getState(record: { get: (field: string) => unknown }): string {
    const workflow = this.workflows.get(
      (record as { constructor: { _name: string } }).constructor._name
    );
    if (!workflow) return '';
    return String(record.get(workflow.field)) || workflow.initial;
  }
  
  // Execute transition
  async executeTransition(
    record: { get: (f: string) => unknown; write: (v: Record<string, unknown>) => Promise<void> } & Record<string, unknown>,
    trigger: string
  ): Promise<boolean> {
    const modelName = (record as { constructor: { _name: string } }).constructor._name;
    const workflow = this.workflows.get(modelName);
    
    if (!workflow) {
      throw new Error(`No workflow defined for model ${modelName}`);
    }
    
    const currentState = this.getState(record);
    
    // Find applicable transition
    const transition = workflow.transitions.find(t => {
      if (t.trigger !== trigger) return false;
      
      const fromStates = Array.isArray(t.from) ? t.from : [t.from];
      return fromStates.includes(currentState) || fromStates.includes('*');
    });
    
    if (!transition) {
      throw new Error(
        `No transition found for trigger "${trigger}" from state "${currentState}"`
      );
    }
    
    // Check condition
    if (transition.condition) {
      const conditionMethod = record[transition.condition] as () => boolean;
      if (typeof conditionMethod === 'function') {
        const canTransition = await conditionMethod.call(record);
        if (!canTransition) {
          throw new Error(
            `Transition condition not satisfied: ${transition.condition}`
          );
        }
      }
    }
    
    // Execute onExit of current state
    const currentStateDef = workflow.states.find(s => s.name === currentState);
    if (currentStateDef?.onExit) {
      const onExitMethod = record[currentStateDef.onExit] as () => Promise<void>;
      if (typeof onExitMethod === 'function') {
        await onExitMethod.call(record);
      }
    }
    
    // Execute transition action
    if (transition.action) {
      const actionMethod = record[transition.action] as () => Promise<void>;
      if (typeof actionMethod === 'function') {
        await actionMethod.call(record);
      }
    }
    
    // Update state
    await record.write({ [workflow.field]: transition.to });
    
    // Execute onEnter of new state
    const newStateDef = workflow.states.find(s => s.name === transition.to);
    if (newStateDef?.onEnter) {
      const onEnterMethod = record[newStateDef.onEnter] as () => Promise<void>;
      if (typeof onEnterMethod === 'function') {
        await onEnterMethod.call(record);
      }
    }
    
    return true;
  }
  
  // Get available transitions
  getAvailableTransitions(
    record: { get: (f: string) => unknown; constructor: { _name: string } }
  ): TransitionDefinition[] {
    const modelName = record.constructor._name;
    const workflow = this.workflows.get(modelName);
    
    if (!workflow) return [];
    
    const currentState = this.getState(record);
    
    return workflow.transitions.filter(t => {
      const fromStates = Array.isArray(t.from) ? t.from : [t.from];
      return fromStates.includes(currentState) || fromStates.includes('*');
    });
  }
  
  // Get state buttons for UI
  getStateButtons(
    record: { get: (f: string) => unknown; constructor: { _name: string } }
  ): TransitionButton[] {
    const transitions = this.getAvailableTransitions(record);
    return transitions
      .filter(t => t.button)
      .map(t => t.button!);
  }
  
  // Get state definition
  getStateDefinition(model: string, stateName: string): StateDefinition | undefined {
    const workflow = this.workflows.get(model);
    if (!workflow) return undefined;
    return workflow.states.find(s => s.name === stateName);
  }
  
  // Get all states for model
  getStates(model: string): StateDefinition[] {
    const workflow = this.workflows.get(model);
    return workflow?.states || [];
  }
}

// Workflow decorator
export function workflow(definition: WorkflowDefinition) {
  return function <T extends { _name: string }>(target: T) {
    WorkflowEngine.getInstance().register({
      ...definition,
      model: target._name
    });
    return target;
  };
}

// Export singleton
export const workflowEngine = WorkflowEngine.getInstance();
