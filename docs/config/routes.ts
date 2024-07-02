export type RoutesItemType = {
  name?: string;
  path: string;
  collapsed?: boolean;
  icon?: any;
  items?: RoutesItemType[];
};

export const iconRoutes: RoutesItemType[] = [
  {
    name: 'all icons',
    path: '/icons/all',
  },
  {
    name: 'outline icons',
    path: '/icons/outline',
  },
  {
    name: 'bold icons',
    path: '/icons/bold',
  },
  {
    name: 'sharp icons',
    path: '/icons/sharp',
  },
  {
    name: 'brand icons',
    path: '/icons/brand',
  },
];
