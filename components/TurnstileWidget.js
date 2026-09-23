'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SITE_KEY = '0x4AAAAAAFAu42dzwqwIIzam';

const TurnstileWidget = forwardRef(function TurnstileWidget({ action, onToken, disabled = false }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const reset = () => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
    onTokenRef.current?.('');
  };

  useImperativeHandle(ref, () => ({ reset }), []);

  useEffect(() => {
    let cancelled = false;
    let timer;

    onTokenRef.current?.('');

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) {
        if (!cancelled) timer = window.setTimeout(render, 100);
        return;
      }

      containerRef.current.innerHTML = '';
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        action,
        theme: 'light',
        callback: (token) => onTokenRef.current?.(token),
        'expired-callback': () => onTokenRef.current?.(''),
        'error-callback': () => onTokenRef.current?.(''),
      });
    };

    render();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [action]);

  return (
    <div
      ref={containerRef}
      aria-disabled={disabled}
      className={disabled ? 'pointer-events-none opacity-60' : ''}
    />
  );
});

export default TurnstileWidget;
