'use client';

import { imgDataUrl1, imgDataUrl2 } from "@/_lib/test";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, SetStateAction } from 'react';
import Button from "./wrappers/button";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNotif } from "@/_lib/context/notifContext";
import useUserDet from "@/_lib/context/userDetailsContext";

const EXPORT_SIZE = 512;

const ImageCropper = ({ imgSrc, setImgSrc, setProccessing, file }: { 
  imgSrc: string,
  setImgSrc: (src: string | null) => void,
  setProccessing: React.Dispatch<SetStateAction<boolean>>,
  file: React.RefObject<File | null>
}) => {
  const [ src, setsrc ] = useState(imgDataUrl2);
  const [ cropDisplay, setCropDisplay ] = useState({ w: 0, h: 0, l: 0, t: 0});
  const [ imgNaturalDimen, setImgNaturalDimen ] = useState({ w: 0, h: 0});
  const [ imgPos, setImgPos ] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const scaleRef = useRef(1);
  const [ drag, setDrag ] = useState(false);
  const [ pinch, setPinch ] = useState(false);
  const [ touchDrag, setTouchDrag ] = useState(false);
  const [minMax, setMinMax] = useState({
    minX: 0,
    maxX: 0,
    maxY: 0,
    minY: 0
  });
  const notif = useNotif();
  
  const pinchDis = useRef<number | null>(null)
  const imgDimen = useRef({ w: 0, h: 0});
  const cropperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const dragPosRef = useRef({ x: 0, y: 0, top: 0, left: 0, width: 0, height: 0 });
  const maxRef = useRef({ x: 0, y: 0});

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log('start drag')
    setDrag(true);
    dragPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      ...imgPos
    };
  }, [imgPos]);
   
  // handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touches = e.touches;
    console.log('touch', touches.length)

    // for dragging
    if (touches.length === 1) {
      setTouchDrag(true);
      dragPosRef.current = ({
        x: touches[0].clientX,
        y: touches[0].clientY,
        ...imgPos
      })
    } // for zooming pinching
    else if(touches.length === 2) {
      setPinch(true);
      pinchDis.current = null;
    }
  }, [imgPos]);

  // initialization
  useEffect(() => {
    
    function handleResize() {
      if (imgRef.current && cropperRef.current && parentRef.current) {
        const img = imgRef.current;
        const cropper = cropperRef.current;
        const parent = parentRef.current;
        const cropperRect = cropper.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        //const imgRect = img.getBoundingClientRect();

        setCropDisplay({ 
          w: cropper.offsetWidth, 
          h: cropper.offsetHeight,
          t: cropperRect.top - parentRect.top,
          l: cropperRect.left - parentRect.left
        });
        
        if (img.naturalWidth > img.naturalHeight) {
          const ratio = cropper.offsetHeight / img.naturalHeight;

          // center the img
          setImgPos({
            top: ((cropperRect.top - parentRect.top) + 1),
            left: (parent.offsetWidth - (img.naturalWidth * ratio)) / 2,
            height: cropper.offsetHeight,
            width: (img.naturalWidth * ratio)
          })
          imgDimen.current = {
            w: (img.naturalWidth * ratio),
            h: cropper.offsetHeight,
          }
        } else {
          const wRatio = cropper.offsetWidth / img.naturalWidth;
          
          // center the img
          setImgPos({
            top: (parent.offsetHeight - (img.naturalHeight * wRatio)) / 2,
            left: ((cropperRect.left - parentRect.left) + 1),
            width: cropper.offsetWidth,
            height: (img.naturalHeight * wRatio)
          })
          imgDimen.current = {
            w: cropper.offsetWidth,
            h: (img.naturalHeight * wRatio)
          }
        }

        // console.log({
        //   crr: cropperRect.right,
        //   crb: cropperRect.bottom,
        //   prt: parentRect.top,
        //   prl: parentRect.left,
        //   ...imgDimen.current,
        //   maxX: (cropperRect.x - parentRect.x) + 1,
        //   maxY: (cropperRect.y - parentRect.y) + 1
        // })

        setMinMax({
          minX: ((cropperRect.right - parentRect.left) - (imgDimen.current.w)),
          minY: ((cropperRect.bottom - parentRect.top) - (imgDimen.current.h)),
          maxX: (cropperRect.x - parentRect.x) + 1,
          maxY: (cropperRect.y - parentRect.y) + 1
        });
        
        maxRef.current = {
          x: (cropperRect.x - parentRect.x) + 1,
          y: (cropperRect.y - parentRect.y) + 1
        }
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    const img = imgRef.current;
    if (img) {
      setImgNaturalDimen({
        w: img.naturalWidth,
        h: img.naturalHeight
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  // set img listener
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      img.removeEventListener('touchstart', handleTouchStart);
    }
  }, [handleTouchStart])

  // callback when pointer moves
  const onPointerOrTouchMove = useCallback((e: MouseEvent | TouchEvent ) => {
    e.preventDefault();
    if (
      (!drag && typeof MouseEvent !== undefined && e instanceof MouseEvent) ||
      (!touchDrag && typeof TouchEvent !== undefined && e instanceof TouchEvent)
    ) {
      return;
    } 
    console.log(touchDrag)

    let x: number = 0, y: number = 0;
    if (typeof TouchEvent !== undefined && e instanceof TouchEvent) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if (typeof MouseEvent !== undefined && e instanceof MouseEvent) {
      x = e.clientX;
      y = e.clientY;
    }
    const dx = x - dragPosRef.current.x;
    const dy = y - dragPosRef.current.y;
    const { left, top } = dragPosRef.current;
    const { minY, minX, maxY, maxX } = minMax;

    //console.log(minMax, left, top, dx, dy);

    setImgPos((prev) => {
      return {
        ...prev,
        left: clamp(left + dx, minX, maxX),
        top: clamp(top + dy, minY, maxY),
      };
    })

  }, [drag, minMax, touchDrag]);

  // pointer lifts
  const stopDrag = useCallback(() => {
    //console.log('stop drag')
    setDrag(false);
  }, []);

  // touch lifts
  const stopTouchDrag = useCallback(() => {
    console.log('touch end')
    setTouchDrag(false);
    setPinch(false);
    pinchDis.current = null;
  }, []);

  // for pointer moving
  useEffect(() => {
    if (!drag && !touchDrag) return;

    window.addEventListener('mousemove', onPointerOrTouchMove, { passive: false });
    window.addEventListener('touchmove', onPointerOrTouchMove, {
      passive: false
    })

    window.addEventListener('touchend', stopTouchDrag);
    window.addEventListener('touchcancel', stopTouchDrag);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('touchend', stopTouchDrag);
      window.removeEventListener('touchcancel', stopTouchDrag);
      window.removeEventListener('touchmove', onPointerOrTouchMove);
      window.removeEventListener('mousemove', onPointerOrTouchMove);
      window.removeEventListener('mouseup', stopDrag);
    }
  }, [drag, onPointerOrTouchMove, stopDrag, touchDrag, stopTouchDrag]);

  // scale
  const scale = useCallback(() => {
    const par = parentRef.current;
    const cropper = cropperRef.current;
    if (!cropper || !par) return;

    const crRect = cropper.getBoundingClientRect();
    const parRect = par.getBoundingClientRect();

    setMinMax((prev) => {
      return {
        ...prev,
        minX: (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current),
        minY: (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current)
      }
    });

    setImgPos((prev) => {
      // console.log({
      //   top: clamp(prev.top, (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current), maxRef.current.y),
      //   left: clamp(prev.left, (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current), maxRef.current.x),
      // })
      return {
        top: clamp(prev.top, (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current), maxRef.current.y),
        left: clamp(prev.left, (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current), maxRef.current.x),
        width: imgDimen.current.w * scaleRef.current,
        height: imgDimen.current.h * scaleRef.current,
      }
    });
  }, [])
  
  // handle pinching
  const handlePinch = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (pinchDis.current !== null) {
        const delta = distance - pinchDis.current;
        const zoomFactor = 0.005; // tune this to taste
        scaleRef.current = clamp(scaleRef.current + delta * zoomFactor, 1, 2);
        scale();
      }

      pinchDis.current = distance;
    }
  }, [scale])
  
  // listen pinching
  useEffect(() => {
    const img = imgRef.current;
    if (!pinch || !img) return;

    img.addEventListener('touchmove', handlePinch);
    return () => {
      img.removeEventListener('touchmove', handlePinch);
    }
  }, [pinch, handlePinch])

  // handle Zooming mouse wheel and track pad
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey && !drag) {
        e.preventDefault(); // stop the browser from actually zooming the page
        const delta = -e.deltaY * 0.008;
        //console.log(delta);
        scaleRef.current = clamp(scaleRef.current + delta, 1, 2);
        scale();
        // const crRect = cropper.getBoundingClientRect();
        // const parRect = par.getBoundingClientRect();

        // setMinMax((prev) => {
        //   return {
        //     ...prev,
        //     minX: (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current),
        //     minY: (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current)
        //   }
        // });

        // setImgPos((prev) => {
        //   // console.log({
        //   //   top: clamp(prev.top, (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current), maxRef.current.y),
        //   //   left: clamp(prev.left, (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current), maxRef.current.x),
        //   // })
        //   return {
        //     top: clamp(prev.top, (crRect.bottom - parRect.top) - (imgDimen.current.h * scaleRef.current), maxRef.current.y),
        //     left: clamp(prev.left, (crRect.right - parRect.left) - (imgDimen.current.w * scaleRef.current), maxRef.current.x),
        //     width: imgDimen.current.w * scaleRef.current,
        //     height: imgDimen.current.h * scaleRef.current,
        //   }
        // });

        //console.log('w', imgDimen.current.w * scaleRef.current);
      }
    };

    img.addEventListener("wheel", handleWheel, { passive: false });
    return () => img.removeEventListener("wheel", handleWheel);
  }, [drag, scale])

  // handle save
  const save = () => {
    const img = imgRef.current;
    if (!img) return;

    const imgScale = imgNaturalDimen.w / imgPos.width;
    const x = (cropDisplay.l + -imgPos.left) * imgScale;
    const y = (cropDisplay.t + -imgPos.top) * imgScale;

    const canvas = document.createElement('canvas');
    canvas.height = EXPORT_SIZE;
    canvas.width = EXPORT_SIZE;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
      img,
      x, y, (cropDisplay.w * imgScale), (cropDisplay.h * imgScale),
      0, 0, canvas.width, canvas.height
    )

    setProccessing(true);

    canvas.toBlob((blob) => {
      if (!blob) {
        notif?.setNotif({
          message: 'Unable to process your image, please try again',
          color: 'error3'
        });

        setProccessing(false)
        return setImgSrc(null);
      }

      file.current = new File([blob], `${Date.now()}.png`, {
        type: blob.type,
        lastModified: Date.now(),
      })

      console.log(file);

      setProccessing(false);
    }, 'image/png', 1)

    setImgSrc(canvas.toDataURL());
    //setsrc(canvas.toDataURL('image/png'));
  }

  return (
    <div ref={parentRef} className="w-full h-full flex justify-center items-center overflow-hidden relative z-50">

      {/** image */}
      <Image ref={imgRef} width={256} height={256} src={imgSrc} alt="profile pic" className="absolute z-10 cursor-move max-w-99999" onMouseDown={handleMouseDown} style={{
        top: imgPos.top,
        left: imgPos.left,
        width: imgPos.width,
        height: imgPos.height
      }} />

      {/** cropper cirle */}
      <div ref={cropperRef} className="w-[60%] min-w-100 max-w-150 aspect-square z-20 pointer-events-none rounded-full border border-white circleFrame" />

      {/** buttons */}
      <div className="absolute top-0 left-0 w-full flex z-30 flex-row justify-between p-5">
          
        {/** save */}
        <Button bgspan="fore/10" click={save} title="save" className="rounded-full p-2 hover:bg-back3">
          <FaCheck className="text-fore2 text-3xl" />
        </Button>

        {/** cancel */}
        <Button bgspan="fore/10" click={() => setImgSrc(null)} title="cancel"  className="rounded-full p-2 hover:bg-back3">
          <IoClose className="text-fore2 text-3xl" />
        </Button>
      </div>

    </div>
  )
}

export default ImageCropper;

const clamp = (val: number, min: number, max: number) => {
  return Math.max(min, Math.min(val, max));
}

