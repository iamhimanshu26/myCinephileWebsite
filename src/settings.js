const Settings = {
  dots: false,
  infinite: false,
  speed: 420,
  slidesToShow: 7,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 3,
        dots: false,
      },
    },
    {
      breakpoint: 1180,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
      },
    },
  ],
};

export default Settings;
