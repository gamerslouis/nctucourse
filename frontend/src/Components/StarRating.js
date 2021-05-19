import { Star, StarBorder } from '@material-ui/icons'
import React from 'react'

export const RatingEdit = ({ size, value, onChange, ...otherProps }) => {
    const [hover, setHover] = React.useState(0)
    return (
        <div {...otherProps} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
            {
                new Array(size).fill(0).map(
                    (_, idx) => (
                        <div key={idx}>
                            {
                                (hover === 0 && value === 0)
                                    ?
                                    <StarBorder onClick={evt => onChange(idx + 1)}
                                        onMouseEnter={evt => setHover(idx + 1)}
                                        onMouseLeave={evt => setHover(0)} />
                                    :
                                    (idx >= (hover || value)) ?
                                        <StarBorder onClick={evt => onChange(idx + 1)}
                                            onMouseEnter={evt => setHover(idx + 1)}
                                            onMouseLeave={evt => setHover(0)} />
                                        :
                                        <Star onClick={evt => onChange(idx + 1)}
                                            onMouseEnter={evt => setHover(idx + 1)}
                                            onMouseLeave={evt => setHover(0)}
                                            style={{ color: 'orange' }} />
                            }
                        </div>
                    )
                )
            }
        </div>
    )
}

export const RatingDisplay = ({ size, value, ...otherProps }) => {
    const width = Math.round(24 * (value % 1))
    return (
        <div {...otherProps} style={{ display: 'flex', flexDirection: 'row' }}>
            {
                new Array(size).fill(0).map(
                    (_, idx) => (
                        <div key={idx}>
                            {
                                isNaN(value)
                                    ?
                                    <Star style={{ color: 'gray' }} />
                                    :
                                    (idx + 1 <= value)
                                        ?
                                        <Star style={{ color: 'orange' }} />
                                        :
                                        (idx > value) ?
                                            <StarBorder />
                                            :
                                            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                                                <div style={{ position: 'absolute', width: `${width}px`, height: '24px', top: 0, left: 0, overflow: 'hidden' }} >
                                                    <Star style={{ color: 'orange' }} />
                                                </div>
                                                <div style={{ position: 'absolute', width: `${24 - width}px`, height: '24px', top: 0, right: 0, overflow: 'hidden' }} >
                                                    <StarBorder style={{ position: 'absolute', top: 0, right: 0 }} />
                                                </div>
                                            </div>
                            }
                        </div>
                    )
                )
            }

        </div>
    )
}
