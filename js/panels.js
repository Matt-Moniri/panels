// --------------------------      Panels        -----------------------------
/**
 * In this program I have tried to implement the widely-used panels by jQuery.
 * I have not used jQury-UI, although it is an option when customization is not
 * important. By using pure jQuery we will have full control over the code for future
 * maintenance and improvements. The panels implemented are
 * "Hamburger Button", "Menu List","Accordion", "Tabs" , "Image Viewer" and "Slide Show"
 */

/**
 * -----------------------     Hamburger Button      ------------------
 * If you refer to the "#pMenu" in the html code you can see that the menu button
 * actually consists of a label with "#pMenuButton" which contains a checkbox and a div.
 * Using CSS, the checkbox is made invisible and its size zero.
 * The mentioned div which has a class ".canvas" is acting like a wallpaper.
 * Because the checkbox is contained inside a label,
 * clicking the label is like clicking the checkbox itself,
 * so clicking the label toggles the checkbox.
 * So we put the listener on the label whose id is 'pMenuButton'
 * and the listener will activate the showMenu().
 * A div with id='menuList' is the list that moves up or down when we click the
 * 'pMenuButton'.
 * showMenu() is responsible to toggle the 'menuList' up and down.
 */
$(document).ready(() => {
  // tradition to make sure DOM is loaded
  $("#menuList").hide(); // initially hide the #menuList
  menuListAjust(); // use this function to adjust the location of #menuList

  // a listener to adjust the location of #menuList when window size changes
  $(window).resize(menuListAjust);

  // a listener to do the slideToggle action when the icon is clicked
  $("#pMenuButton").on("change", function (e) {
    $("#menuList").slideToggle();
  });

  /**
   * Using jQuery we find the correct top and left values. Then we use these values to
   * correctly adjust the location of the menuList. Before that we hide the 'menuList' using jQuery.
   */
  function menuListAjust() {
    $("#menuList").css({
      top: `${$("#header").offset().top + $("#header").height()}px`,
      left: `${$("#header").offset().left}px`,
    });
  }

  // ------------------------       Accordion         -----------------------------

  // please refer to #accordion on the html
  $(".accordionDrop").hide(); // hide all ".accordionDrop"s this applies {display:none} in css
  $(".accordionButton").click((e) => {
    e.preventDefault();

    // if the accordionDrop relating to the clicked accordionButton is hidden,
    // we first slideUp all the "accordionDrop"s then slideDown the wnated accordionDrop
    if ($(e.target).next().css("display") == "none") {
      $(".accordionDrop").slideUp();
      $(e.target).next().slideDown();

      // if the accordionDrop relating to the clicked accordionButton is not hidden,
      // we only slide it up.
    } else {
      $(e.target).next().slideUp();
    }
  });

  /* -------------------------------  Tabs   ----------------------------------  */

  /**
   * here we add or remove "active" class from the components and
   * the css automatically shows the active ones.
   */
  $(".tabButton").click((e) => {
    e.preventDefault();
    $(".tabButton").removeClass("active"); // remove "active" class from all tabButtons
    $(e.target).addClass("active"); // make the clicked tabButton active
    $(".tab").removeClass("active"); // remove "active" class from all tabs
    href = $(e.target).attr("href"); // record the href of the clicked tabButton

    // the tab that has the id equal to the href we recorded above becomes active
    $(`${href}`).addClass("active");
  });

  /*-------------------------------Image Viewer -------------------------------- */
  /**
   * This is a panel that has a large frame and three thumbnails at the bottom of it.
   * The thumbnails are very small files so load very quickly at the start.
   * If the user wants a thumbnail to be shown in the larg frame, he clicks it.
   * Then the program checks if the requested image is already downloaded from the server.
   * If it was there, it will be shown in the large frame,
   * but if it was not already downloaded, the program does 2 thing:
   * first, it puts a loading sign in the big frame and
   * second, it creates a jquery object of the requested img in order to
   * make the browser to start downloading it.
   */

  var cache = [];

  $("#thumbnails a")
    .click((e) => {
      e.preventDefault();
      var targetImage = $(e.currentTarget).attr("href");
      $("#thumbnails a").removeClass("active");
      $(e.currentTarget).addClass("active");
      showBig(targetImage);
    })
    .eq(0)
    .click();

  // This function takes a url and shows the image in it
  function showBig(imgUrl) {
    // if the url is already in the "cache" array,
    if (cache.includes(imgUrl)) {
      var $a = $("<div></div>"); // declare $a as an empty jQuery object

      // iterate through all thumbnails to fine that has href=imgUrl and record it in $a
      $("#thumbnails a").each((index, value) => {
        if ($(value).attr("href") == imgUrl) {
          $a = $(value);
        }
      });

      // if $a is still "active" we show it otherwise we do nothing
      if ($a.hasClass("active")) {
        $("#bigFrame").css({
          "background-image": `url(${imgUrl})`,
        });
      }

      // if the url is not in the "cache" array yet, we need to load it and show "loading" sign.
    } else {
      $("#bigFrame").css({
        "background-image": `url('../img/loading.jpg')`,
      });
      $fetchingImage = $("<img>"); // create a jQuery object
      $fetchingImage.attr("src", imgUrl);

      // when the loading is done, add the url to cache and then show it
      $fetchingImage.load(() => {
        cache.push(imgUrl);
        showBig(imgUrl);
      });
    }
  }

  /*-------------------------------Slide Show -------------------------------- */
  /**
   * The Slide Show is a panel that has a frame for showing pictures.
   * Several pictures in a queue are shown in the frame witha sliding animation
   * There is also a dot for each picture underneath the frame
   * which acts loke a shortcut button to that picture.
   */

  // This function take an "index" and puts the image relating to that index in the fram
  function slidePut(index) {
    $(`#slideShowImage${index}`).css({
      // Put the image of the given index in the frame
      left: "0px",
    });
    $currentSlide = $(`#slideShowImage${index}`);

    // increment the index and keep the result value under 4 the asign the result to slideIndex
    // slideIndex is a global variable used to indicate the next upcomming slide
    slideIndex = (slideIndex + 1) % 4;
    $(".slideShowImage").removeClass("active"); // deactivate all the images
    $(".slideShowButtonCheckbox").prop("checked", false); // make all the buttons un-selected
    $currentSlide.addClass("active"); // activate the wanted image
    $(`#slideShowButtonCheckbox${index}`).prop("checked", true); // activate the relevant button
  }

  /**
   * This function takes an index and animates the corresponding image into the frame.
   */
  function slidePush(index) {
    let posNewSlideStart, posNewSlideEnd;
    if (index == 0) {
      // the starting position of the new slide depends on its index
      posNewSlideStart = -550; // if index is 0 it will start from from left
    } else {
      posNewSlideStart = 550; // for other indexes the new slide strats from right
    }

    // when the new slide is animated in and the current slide out,
    // mathematically the final position of the current slide will be as below:
    $currentSlide.animate(
      {
        left: `${-1 * posNewSlideStart}px`,
      },
      400
    );
    $newSlide = $(`#slideShowImage${index}`); // pick the new slide based on the index
    $(".slideShowImage").removeClass("active"); // deactivate all images
    $(".slideShowButtonCheckbox").prop("checked", false); // deactivate all buttons
    $newSlide
      .css({
        left: `${posNewSlideStart}px`, // put the new slide at starting position
      })
      .animate(
        // animate it to final position
        {
          left: "0px",
        },
        400,
        () => {
          // after the animation is finished,  $currentSlide becomes $newSlide
          $currentSlide = $newSlide;
          $currentSlide.addClass("active"); // activate the $currentSlide

          // activate the button for currentSlide
          $(`#slideShowButtonCheckbox${index}`).prop("checked", true);
        }
      );

    // at last we increment the slideIndex and keep it below 4 because we have 4 slides
    // in total. The slideIndex points to the next upcomming slide.
    slideIndex = (slideIndex + 1) % 4;
  }

  // This function scans the html and creates the needed buttons underneath the big frame
  function createSlideShowButtons() {
    let $buttons = $("<div id='slideShowButtons'></div>");
    for (let i = 0; i < $(".slideShowImage").length; i++) {
      $button = $(
        `<label class='slideShowButton' id='slideShowButton${i}' data-index='${i}'></label>`
      );
      let $buttonCheckbox = $(
        `<input type='checkbox' class='slideShowButtonCheckbox' id='slideShowButtonCheckbox${i}' ></input>`
      );
      $button.append($buttonCheckbox);
      let $buttonDiv = $(`<div id='slideShowButtonDiv${i}'></div>`);
      $button.append($buttonDiv);
      $buttons.append($button);
    }

    $buttons.hide().appendTo($("#slideShow"));
    buttonDiameter = Math.floor(parseInt($button.eq(0).css("width")));
    buttonMargin = Math.floor(buttonDiameter * 1.8);
    $(".slideShowButton").each((index, element) => {
      $(element).css({ left: `${Math.floor(buttonMargin * index)}px` });
    });
    length = $(".slideShowImage").length;
    ButtonsWidth = length * buttonMargin + buttonDiameter;
    $buttons
      .css({
        left: `${Math.floor(275 - Math.floor(ButtonsWidth / 2))}px`,
        "margin-top": `${buttonDiameter}px`,
      })
      .show();
    $(".slideShowButton").on("click", slideShowButtonListener);
  }

  // When a button is clicked, this listener puts the relevent image on the frame
  // and cancels the animation
  function slideShowButtonListener(e) {
    e.preventDefault();
    let imageIndex = $(e.currentTarget).data("index");
    imageIndex = parseInt(imageIndex);
    $(".slideShowImage").stop();
    clearInterval(slideShowInterval);
    $(".slideShowImage").css({ left: "550px" });
    slidePut(imageIndex);
  }

  /**
   * in the root of the function we first create the buttons
   * then set slideIndex = 0, then put the first slide in the frame
   * and after that start the animation loop
   */
  createSlideShowButtons();
  slideIndex = 0;
  slidePut(slideIndex);
  var slideShowInterval = setInterval(() => {
    console.log("interval");
    slidePush(slideIndex);
  }, 2500);
});
