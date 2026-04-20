interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const spinnerSizes = {
  small: 'w-6 h-6 border-3',
  medium: 'w-10 h-10 border-4',
  large: 'w-12 h-12 border-4',
};

export function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`rounded-full border-nasmed-green border-t-transparent animate-spin ${spinnerSizes[size]} ${className}`} />
  );
}

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingScreen({
  message = 'Loading...',
  size = 'medium',
  className = '',
}: LoadingScreenProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-nasmed-off-white ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={size} />
        <p className="text-nasmed-text-muted text-sm">{message}</p>
      </div>
    </div>
  );
}
