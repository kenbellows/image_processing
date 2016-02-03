(function(wnd) {
  // requires imgproc.js, but this will allow loading files in any order
  var imgproc = wnd.imgproc || (wnd.imgproc={});
  if (!imgproc.defaults) imgproc.defaults = {};
  imgproc.defaults.kernel_size = 5;

  imgproc.convolution = function(source, kernel_source, size) {
    var imgData;
    if (source.constructor === CanvasRenderingContext2D)
      imgData = ctx.getImageData();
    else if (source.constructor === ImageData)
      imgData = source;
    else throw 'Convolution Error: image source must be either a CanvasRenderingContext2D or an ImageData; received '+source.constructor.name;
    
    wnd.CONV_IMG_DATA = imgData;
    var resultData = new ImageData(imgData.width, imgData.height),
        size = size || imgproc.defaults.kernel_size,
        half_size = Math.floor(size/2);
    // loop through every pixel
    for (var y=0; y<imgData.height; y++) {
      for (var x=0; x<imgData.width; x++) {
        var kernel, area;
        
        // find the image area to be affected by our kernel
        area = {
          left: x-half_size,
          top:  y-half_size,
          right:  x+half_size,
          bottom: y+half_size,
          center: {x: x, y: y},
          pixels: []
        };
        
        // clip area at image edges
        if (area.left < 0) area.left = 0;
        if (area.top  < 0) area.top = 0;
        if (area.right  >= imgData.width) area.right = imgData.width-1;
        if (area.bottom >= imgData.height) area.bottom = imgData.height-1;
        
        // load up the area's pixels
        for (var ay=area.top; ay<=area.bottom; ay++) {
          var arow = [];
          for (var ax=area.left; ax<=area.right; ax++) {
            arow.push(imgproc.getPixel(imgData, ax, ay));
          }
          area.pixels.push(arow);
        }
        
        // figure out the kernel if it needs figuring
        if (kernel_source.constructor === Function) kernel = kernel_source(area);
        else kernel = kernel_source;
        
        var area_sum = new imgproc.Pixel();
        var kernel_sum = new imgproc.Pixel();
        for (var j=0; j<area.pixels.length; j++) {
          for (var i=0; i<area.pixels[0].length; i++) {
            // multiply each color channel of this pixel by its weight
            var apixel = area.pixels[j][i],
                kpixel = kernel[j][i];
            area_sum.r += apixel.r * kpixel.r;
            area_sum.g += apixel.g * kpixel.g;
            area_sum.b += apixel.b * kpixel.b;
            kernel_sum.r += kpixel.r;
            kernel_sum.g += kpixel.g;
            kernel_sum.b += kpixel.b;
          }
        }
        
        //console.log(pixloc+':'+(pixloc+4)+' sums:\t['+(area_sum.r+'/'+kernel_sum.r)+','+(area_sum.g+'/'+kernel_sum.g)+','+(area_sum.r+'/'+kernel_sum.r)+',255]');
        // find averages for each channel
        var area_avg = new imgproc.Pixel(
          Math.floor(area_sum.r / kernel_sum.r),
          Math.floor(area_sum.g / kernel_sum.g),
          Math.floor(area_sum.b / kernel_sum.b)
        );
        
        // store convolved pixel in result imageData
        var pixloc = imgproc.getPixelLocation(imgData,x,y); // see imgproc.js
        
        //console.log(pixloc+':'+(pixloc+4)+'\t['+Math.round(area_avg.r)+','+Math.round(area_avg.g)+','+Math.round(area_avg.r)+',255]');
        resultData.data[pixloc]   = Math.round(area_avg.r);
        resultData.data[pixloc+1] = Math.round(area_avg.g);
        resultData.data[pixloc+2] = Math.round(area_avg.b);
        resultData.data[pixloc+3] = 255;
      }
    }

    // return the resulting imageData object
    return resultData;
  };

})(window);
