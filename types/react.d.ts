declare namespace React {
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
  
  // Event handlers and state
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
}

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'next/link' {
  import { ReactNode } from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children: ReactNode;
  }

  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    prefetch: (url: string) => void;
    back: () => void;
    forward: () => void;
  };

  export function useParams(): Record<string, string>;
}

declare module 'styled-components' {
  import React from 'react';
  
  type StyledFunction = (...args: any[]) => any;
  
  interface StyledInterface {
    div: StyledFunction;
    a: StyledFunction;
    p: StyledFunction;
    button: StyledFunction;
    h1: StyledFunction;
    h2: StyledFunction;
    h3: StyledFunction;
    h4: StyledFunction;
    span: StyledFunction;
    input: StyledFunction;
    select: StyledFunction;
    textarea: StyledFunction;
    form: StyledFunction;
    label: StyledFunction;
    ul: StyledFunction;
    li: StyledFunction;
    section: StyledFunction;
    nav: StyledFunction;
    header: StyledFunction;
    footer: StyledFunction;
    article: StyledFunction;
    aside: StyledFunction;
    main: StyledFunction;
  }

  type StyledComponent<T> = (component: T) => StyledFunction;

  const styled: StyledInterface & {
    [key: string]: StyledFunction;
  } & StyledComponent<any>;
  
  export default styled;
} 