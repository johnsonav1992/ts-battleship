/**
 * This function converts numeric px values into a string of rem values.
 *
 * 4 values: top, right, bottom, left
 *
 * 3 values: top, horizontal, bottom
 *
 * 2 values: vertical, horizontal
 *
 * 1 value: all sides
 *
 * @param valx Each of these should be a numeric px value.
 *
 * @example
 * pxrem( 0, 16, 32, 48 ) => '0 1rem 2rem 3rem'
 */

export const pxrem = ( val1: number, val2?: number, val3?: number, val4?: number ) => {
    const pxToRem = ( val: number | undefined ) => {
        if ( val === undefined ) {
            return '';
        } else if ( val === 0 ) {
            return '0';
        } else {
            return `${ val / 16 }rem`;
        }
    };

    return [ pxToRem( val1 ), pxToRem( val2 ), pxToRem( val3 ), pxToRem( val4 ) ].join( ' ' ).trim();
};
