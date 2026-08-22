import { CodeEntry } from '../../types';
import { CodeTable } from './CodeTable';

interface CodeCardProps {
  entry: CodeEntry;
}

export function CodeCard({ entry }: CodeCardProps) {
  return <CodeTable codes={[entry]} />;
}

