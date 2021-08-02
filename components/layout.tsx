import React, {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  // title?: string
};

export default function Layout({children}: Props) {
  return <div>ss{children}</div>;
}
