import React from 'react';
import StationCard from './StationCard';

class Station extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {current: 0};
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleSlideClick = this.handleSlideClick.bind(this);
  }

  handlePreviousClick() {
    const previous = this.state.current - 1;

    this.setState({
      current: previous < 0 ? this.props.slides.length - 1 : previous,
    });
  }

  handleNextClick() {
    const next = this.state.current + 1;

    this.setState({
      current: next === this.props.slides.length ? 0 : next,
    });
  }

  handleSlideClick(index: any) {
    if (this.state.current !== index) {
      this.setState({
        current: index,
      });
    }
  }

  render() {
    const {current, direction} = this.state;
    const {slides, heading} = this.props;
    // const headingId = `slider-heading__${heading
    //   .replace(/\s+/g, '-')
    //   .toLowerCase()}`;
    const wrapperTransform = {
      transform: `translateX(-${current * (100 / slides.length)}%)`,
    };

    return (
      <div className="slider">
        <ul className="slider__wrapper" style={wrapperTransform}>
          <h3 className="visuallyhidden">{heading}</h3>

          {slides.map((slide) => {
            return (
              <StationCard
                key={slide.index}
                slide={slide}
                current={current}
                handleSlideClick={this.handleSlideClick}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Station;
