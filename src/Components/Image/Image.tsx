import { ComponentProps } from 'react';

const Image = ( props: ComponentProps<'img'> ) => {
    return (
        <img { ...props } />
    );
};

export default Image;
