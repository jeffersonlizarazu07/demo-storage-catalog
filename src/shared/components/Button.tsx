import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover dark:bg-white dark:text-primary dark:hover:bg-white/90',
  accent:
    'bg-accent text-white hover:bg-accent-hover shadow-sm',
  outline:
    'border border-border text-primary hover:bg-border dark:border-white/20 dark:text-white dark:hover:bg-white/10',
  ghost:
    'text-muted hover:text-primary hover:bg-border dark:text-muted dark:hover:text-white dark:hover:bg-white/10',
};

const baseClasses =
  'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:pointer-events-none disabled:opacity-50';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type ButtonAsRouterLink = ButtonBaseProps & {
  as: 'router-link';
  to: string;
  children: React.ReactNode;
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink;

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (props.as === 'a') {
    return <a className={allClasses} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  if (props.as === 'router-link') {
    const { to, children, ...rest } = props;
    return (
      <Link to={to} className={allClasses} {...rest}>
        {children}
      </Link>
    );
  }

  return <button className={allClasses} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
