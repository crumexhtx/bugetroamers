import { useEffect } from 'react';

export interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export function JsonLd({ data, id = 'json-ld' }: JsonLdProps) {
  useEffect(() => {
    const scriptId = `json-ld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [data, id]);

  return null;
}

export default JsonLd;
