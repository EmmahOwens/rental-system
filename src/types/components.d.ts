
import React from 'react';

declare module '@/components/NeumorphicCard' {
  export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  export function NeumorphicCard(props: NeumorphicCardProps): JSX.Element;
}
