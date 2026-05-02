import { useState, useCallback } from 'react';

// This custom hook manages toast state — call it in any page
function useToast() {
  const [toast, setToast] = useState(null);

  // Show a toast: useToast('Item reported!', 'success')
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Called when toast closes
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}

export default useToast;