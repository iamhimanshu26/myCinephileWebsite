const Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 10,
  slidesToScroll: 5,
  responsive: [
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 8,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
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
      },
    },
  ],
};

export default Settings;
