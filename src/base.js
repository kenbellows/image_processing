/**
 * base.js
 *
 * ImgProc.js is a collection of image processing functions centered on the HTML5 canvas.
 * This file serves as a base for other files in this package and contains
 * common utility functions used throughout the package.
 * 
 * @namespace ImgProc
 * @author Ken Bellows <ken.bellows@live.com>
 */

/**
 * The built in image data interface; represents the underlying pixel data of an area of a &lt;canvas&gt; element.
 * <br /><br />
 * <strong>Note:</strong> Below is a limited summary of the most commonly used properties and methods of ImageData in this package.
 * @external ImageData
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData|ImageData at MDN}
 * @property {Uint8ClampedArray} data - Effectively a 1-dimensional array of pixel data in the format <code>[R, G, B, A,  R, G, B, A,  ...]</code>
 * @property {Number} width - The width of the image, i.e. the number of pixels per row
 * @property {Number} height - The height of the image, i.e. the number of rows in the image
 */

(function(wnd) {
  // reference the imgproc namespace if it exists, or create it if it doesn't already exist
  var imgproc = wnd.imgproc || (wnd.imgproc={});
  
  
  /**
   * A class to store color and alpha data for a single pixel.
   * The Pixel constructor accepts five forms, ranging from 0 to 4 arguments:
   * <br />
   * <table>
   *   <tr><td>new Pixel()</td><td>rgba(0,0,0,255)</td></tr>
   *   <tr><td>new Pixel(n)</td><td>rgba(n,n,n,255)</td></tr>
   *   <tr><td>new Pixel(n, a)</td><td>rgba(n,n,n,a)</td></tr>
   *   <tr><td>new Pixel(r, g, b)</td><td>rgba(r,g,b,255)</td></tr>
   *   <tr><td>new Pixel(r, g, b, a) &nbsp;</td><td>rgba(r,g,b,a)</td></tr>
   * </table>
   * <br />
   *
   * @class Pixel
   * @memberof ImgProc
   * @param {Number} [r=0] - red color channel value
   * @param {Number} [g=0] - green color channel value
   * @param {Number} [b=0] - blue color channel value
   * @param {Number} [a=255] - alpha channel value
   */
  imgproc.Pixel = function() {
    var r, g, b, a;
    switch (arguments.length) {
      // new Pixel() -> rgba(0,0,0,255);
      case 0:
        r = g = b = 0;
        a = 255;
        break;
      // new Pixel(n) -> rgba(n,n,n,255);
      case 1:
        r = g = b = arguments[0];
        a = 255;
        break;
      // new Pixel(n, a) -> rgba(n,n,n,a);
      case 2:
        r = g = b = arguments[0];
        a = arguments[1];
        break;
      // new Pixel(r, g, b) -> rgba(r,g,b,255);
      case 3:
        r = arguments[0];
        g = arguments[1];
        b = arguments[2];
        a = 255;
        break;
      // new Pixel(r, g, b, a) -> rgba(r,g,b,a);
      // (also ignore any additional arguments and treat a larger number as 4)
      case 4: default:
        r = arguments[0];
        g = arguments[1];
        b = arguments[2];
        a = arguments[3];
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };
  
  /**
   * Finds the index in an {@link external:ImageData} object of the first byte of the pixel at position (x, y) in the image.
   * @function getPixelLocation
   * @memberof ImgProc
   * @param {external:ImageData} imgData
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */
  imgproc.getPixelLocation = function(imgData, x, y) {
    return (y*imgData.width + x)*4; // if pixel (x,y) is the nth pixel, the pixel location is n*4, since each pixel has 4 values (RGBA)
  };

  /**
   * Returns an object with the RGBA information of the pixel at position (x, y) in an {@link external:ImageData} object.
   * @function getPixel
   * @memberof ImgProc
   * @param {external:ImageData} imgData
   * @param {Number} x
   * @param {Number} y
   * @returns {Object}
   */
  imgproc.getPixel = function (imgData, x, y) {
    var pl = imgproc.getPixelLocation(imgData,x,y);
    return new imgproc.Pixel(
      imgData.data[pl],   // red byte
      imgData.data[pl+1], // green byte
      imgData.data[pl+2], // blue byte
      imgData.data[pl+3]  // alpha byte
    );
  };

  /**
   * Determines the average (arthimetic mean) of a list of numbers.
   * Also available as the <code>imgproc.mean</code>.
   * @function average
   * @memberof ImgProc
   * @param {Number[]} nums
   * @returns {Number}
   * @example
   * expect (imgproc.average([2, 4, 4, 4, 5, 5, 7, 9])).toEqual(5)
   */
  imgproc.average = imgproc.mean = function(nums) {
    return nums.reduce(function(sum, n){ return sum+n; })/nums.length;
  };

  /**
   * Determines the standard deviation of a list of numbers.
   *    average      = { average of input numbers }
   *    deviations   = { list of each number's deviation (distance) from the average, squared }
   *    devs_average = { average of deviations }
   *    return sqrt( sqd_average )
   * @function standardDeviation
   * @memberof ImgProc
   * @param {Number[]} nums
   * @returns {Number} sqrt( map(n in nums, ) )
   * @example
   * expect (imgproc.standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toEqual(2)
   * @see {@link https://en.wikipedia.org/wiki/Standard_deviation|wiki:"Standard deviation"}
   */
  imgproc.standardDeviation = function(nums) {
    var average      = imgproc.average(nums),
        deviations   = nums.map(function(n) { return Math.pow(average-n, 2); }),
        devs_average = imgproc.average(deviations);
    return Math.sqrt(devs_average);
  };

})(window);

