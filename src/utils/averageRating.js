import React from 'react'

export const averageRating =  (reviews) => {
    
    // calculating total ratings
    const totalRating=reviews?.reduce((acc,review)=>(
        acc+review.rating
    ),0)

    const multiplier=Math.pow(10,1);

    const AverageRating=Math.round((totalRating/reviews?.length)*multiplier)/multiplier;

    return AverageRating || 0;
}
