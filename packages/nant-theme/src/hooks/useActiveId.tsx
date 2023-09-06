import { lowerCase } from 'lodash-es';
import { useEffect, useState } from 'react';

export const useActiveId = (idList: string[]) => {
  const [activeId, setActiveId] = useState('el');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0% -80% 0%' },
    );
    idList.forEach((id) => {
      const idx = document.getElementById(`${lowerCase(id)}`);
      if (!idx) return;
      observer.observe(idx);
    });

    return () => {
      idList.forEach((id) => {
        const idNode = document.getElementById(id);
        idNode && observer.unobserve(idNode);
      });
    };
  }, [idList]);
  return activeId;
};
