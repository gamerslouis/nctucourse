import { Star, StarBorder } from '@material-ui/icons'
import React from 'react'

export const RatingEdit = ({ size, value, onChange, ...otherProps }) => {
    const [hover, setHover] = React.useState(0)
    return (
        <div {...otherProps} style={{ cursor: 'pointer' }}>
            {
                new Array(size).fill(0).map(
                    (_, idx) => (
                        <>
                            {
                                (hover === 0 && value === 0)
                                    ?
                                    <StarBorder key={idx} onClick={evt => onChange(idx + 1)}
                                        onMouseEnter={evt => setHover(idx + 1)}
                                        onMouseLeave={evt => setHover(0)} />
                                    :
                                    (idx >= (hover || value)) ?
                                        <StarBorder key={idx} onClick={evt => onChange(idx + 1)}
                                            onMouseEnter={evt => setHover(idx + 1)}
                                            onMouseLeave={evt => setHover(0)} />
                                        :
                                        <Star key={idx} onClick={evt => onChange(idx + 1)}
                                            onMouseEnter={evt => setHover(idx + 1)}
                                            onMouseLeave={evt => setHover(0)}
                                            style={{ color: 'orange' }} />
                            }
                        </>
                    )
                )
            }
        </div>
    )
}

export const RatingDisplay = ({ size, value, ...otherProps }) => {
    const width = Math.round(24 * value / 5)
    return (
        <div {...otherProps}>
            {
                new Array(size).fill(0).map(
                    (_, idx) => (
                        <>
                            {
                                (idx + 1 <= value)
                                    ?
                                    <Star key={idx} style={{ color: 'orange' }} />
                                    :
                                    (idx > value) ?
                                        <StarBorder key={idx} />
                                        :
                                        <div key={idx} style={{ position: 'relative', width: '24px', height: '24px' }}>
                                            <div style={{ position: 'absolute', width: `${width}px`, height: '24px', top: 0, left: 0, overflow: 'hidden' }} >
                                                <Star style={{ color: 'orange' }} />
                                            </div>
                                            <div style={{ position: 'absolute', width: `${24 - width}px`, height: '24px', top: 0, right: 0, overflow: 'hidden' }} >
                                                <StarBorder style={{ position: 'absolute', top: 0, right: 0 }} />
                                            </div>
                                        </div>
                            }
                        </>
                    )
                )
            }

        </div>
    )
}
