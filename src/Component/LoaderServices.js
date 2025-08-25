import { loaderRef } from '../../App';

const LoaderService = {
  show: (msg) => {
    loaderRef.current?.show(msg);
  },
  hide: () => {
    loaderRef.current?.hide();
  },
};

export default LoaderService;
