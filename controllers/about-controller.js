export const aboutController = {
  index(request, response) {
    //index method to handle requests for the about page
    const viewData = {
      //data to be passed to the view
      title: "About WeatherTop",
    };
    console.log("about rendering"); //let the user know that the view is rendering
    response.render("about-view", viewData); //render about view with relevant data
  },
};
