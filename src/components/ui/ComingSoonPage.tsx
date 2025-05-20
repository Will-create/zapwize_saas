import { Rocket } from 'lucide-react';

type ComingSoonPageProps = {
  title: string;
  description: string;
};

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <Rocket size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">{description}</p>
        <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;