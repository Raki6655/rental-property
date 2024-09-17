import React from 'react';
type SingleListCardProps = {
    children: React.ReactNode;
    name?: number;
};

const SingleListCard: React.FC<SingleListCardProps> = ({ children }) => {
    return (
        <div>{children}</div>
    );
};

export default SingleListCard;