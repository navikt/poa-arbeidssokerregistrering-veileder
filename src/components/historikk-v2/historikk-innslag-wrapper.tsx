import React from 'react';

type HistorikkInnslagWrapperProps = {
    children: React.ReactNode;
};

const HistorikkInnslagWrapper: React.FC<HistorikkInnslagWrapperProps> = (props) => {
    const { children } = props;

    return <article className=" bg-gray-50/40 mb-4 p-4 rounded-md shadow">{children}</article>;
};

export { HistorikkInnslagWrapper };
