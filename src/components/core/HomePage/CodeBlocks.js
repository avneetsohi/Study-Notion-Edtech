import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { CTAButton } from './Button';
import { TypeAnimation } from 'react-type-animation';
import { HightlightText } from './HightlightText';


export const CodeBlocks = ({position,heading,subHeading,ctabtn1,ctabtn2,codeblock,backgroundGradient,codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

        {/* Section 1 */}
        <div className='w-[50%] flex-col gap-8'>
            <div>{heading}</div>
            <div className='text-richblack-300 font-bold mt-4'>
                {subHeading}
            </div>
            <div className='flex gap-7 mt-16'>
                <CTAButton active={ctabtn1.active} linkTo={ctabtn1.linkTo}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>
                <CTAButton active={ctabtn2.active} linkTo={ctabtn2.linkTo}>
                    {ctabtn2.btnText}
                </CTAButton>
                
            </div>
        </div> 

        {/* Section 2 */}
        <div className={`flex h-fit text-[14x] leading-[22px] w-[50%] px-4 py-4 lg:w-[500px] font-mono code-section  relative`}>
            <div className={`${position==="lg:flex-row"?"ellipse1":"ellipse2"}`}></div>
            <div className='text-center flex flex-col w-[10%] text-richblack-400  font-bold tracking-[-1.68px]'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>

            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor}  pr-2`}>
                <TypeAnimation
                    sequence={[codeblock,2000,""]}
                    repeat={Infinity}
                    omitDeletionAnimation={true}
                    cursor={true}
                    style={
                        {
                            whiteSpace:"pre-line",
                            display:"block"
                        }
                    }
                />
            </div>
        </div>
    </div>
  )
}
