import { LocalProgramArgs, LocalWorkspace, OutputMap } from '@pulumi/pulumi/automation';
import * as upath from 'upath';

const args: LocalProgramArgs = {
  stackName: 'dev',
  workDir: upath.joinSafe(__dirname, '.')
};

export async function deploy(): Promise<OutputMap> {
  console.log('Initialising stack...');
  const stack = await LocalWorkspace.createOrSelectStack(args);
  console.log('Setting region...');
  await stack.setConfig('aws:region', { value: 'us-east-1' });
  await stack.setConfig('aws-native:region', { value: 'us-east-1' });
  console.log('Run update...');
  const up = await stack.up({ onOutput: console.log });
  console.log('Update complete');
  return up.outputs;
}

export async function destroy(): Promise<void> {
  console.log('Selecting stack...');
  const stack = await LocalWorkspace.createOrSelectStack(args);
  console.log('Destroying stack...');
  await stack.destroy({ onOutput: console.log });
  console.log('Stack destroyed');
}

export async function getOutputs(): Promise<OutputMap> {
  console.log('Selecting stack...');
  const stack = await LocalWorkspace.createOrSelectStack(args);
  const outputs = await stack.outputs();
  return outputs;
}
