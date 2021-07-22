import React from 'react';

class Slide extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleSlideClick = this.handleSlideClick.bind(this);
    this.imageLoaded = this.imageLoaded.bind(this);
  }

  handleSlideClick(event: any) {
    this.props.handleSlideClick(this.props.slide.index);
  }

  imageLoaded(event: any) {
    event.target.style.opacity = 1;
  }

  render() {
    const {src, button, headline, index} = this.props.slide;
    const current = this.props.current;
    let classNames = 'slide';

    if (current === index) classNames += ' slide--current';
    else if (current - 1 === index) classNames += ' slide--previous';
    else if (current + 1 === index) classNames += ' slide--next';

    return (
      <li
        //   ref={this.slide}
        className={classNames}
        onClick={this.handleSlideClick}
      >
        <div className="slide__image-wrapper">
          <img
            className="slide__image"
            alt={headline}
            src={src}
            onLoad={this.imageLoaded}
          />
        </div>

        <article className="slide__content">
          <h2 className="slide__headline">{headline}</h2>
        </article>
      </li>
    );
  }
}

export default Slide;
