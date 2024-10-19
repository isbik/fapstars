import { MutableRefObject, useEffect, } from 'react';

export interface UseInfiniteScrollOptions {
  triggerRef: MutableRefObject<HTMLElement>;
  wrapperRef: MutableRefObject<HTMLElement>;
  callback?: () => void;
}
export function useInfiniteScroll({
  triggerRef,
  wrapperRef,
  callback,
}: UseInfiniteScrollOptions) {
  let observer: IntersectionObserver | null;
  

  useEffect(() => {
    console.log('CALL TRIGGERS',{  triggerRef,
        wrapperRef,});
    const wrapperElement = wrapperRef.current;
    const triggerElement = triggerRef.current;

    console.log( '  wrappers refs', {triggerRef,
        wrapperRef, wrapperElement, triggerElement});

    if (callback && triggerElement && wrapperElement) {

        console.log('callback ');
      const options = {
        root: null,  // root: wrapperElement,
        rootMargin: '100px', 
        threshold: 0.1, 
      };

      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          console.log('isIntersecting');

          callback();
        }
      }, options);

      observer.observe(triggerElement);
    }

    return () => {
      if (observer && triggerElement) {
        observer.unobserve(triggerElement);
      }
    };
  }, [triggerRef.current, wrapperRef.current]);
}
