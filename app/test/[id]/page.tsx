import { TestDisplay } from '../TestDisplay';

interface TestPageProps {
  params: {
    id: string;
  };
}

export default function TestPage({ params }: TestPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <TestDisplay testId={params.id} />
    </main>
  );
} 