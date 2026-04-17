import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Login } from '@/features/auth/components/Login';

export default function SigninPage() {
  const [redirectPath, setRedirectPath] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const savedPath = window.localStorage.getItem('loginRedirectPath');
    if (savedPath) {
      setTimeout(() => {
        setRedirectPath(savedPath);
        window.localStorage.removeItem('loginRedirectPath');
      }, 0);
    }

    toast.error('Session expired. Log back in to continue.');
  }, []);

  return <Login isOpen={true} onClose={() => {}} redirectTo={redirectPath} />;
}
