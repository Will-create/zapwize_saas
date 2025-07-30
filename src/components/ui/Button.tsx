import { FC, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
      {children}
    </button>
  );
};

export default Button;
