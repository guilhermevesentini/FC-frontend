import { ElLoading } from 'element-plus';

export default function useGlobalLoading() {
  let loadingInstance: any = null;

  const start = () => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading...',
      background: 'rgba(194, 194, 194, 0.65)',
    });
  };

  const finish = () => {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  };

  return {
    start,
    finish
  };
}
