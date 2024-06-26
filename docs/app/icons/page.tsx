'use client';
import { cn } from '@/utils/cn';
import { logos, outlines, bolds, sharps } from '@nant-design/nant-icons';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/layout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/layout';
import { iconRoutes } from '@/config/routes';
import { CustomizeIcon } from '@/components/layout';

const logoList = Object.entries(logos);
const outlinesList = Object.entries(outlines);
const boldList = Object.entries(bolds);
const sharpList = Object.entries(sharps);

const allList = [...logoList, ...outlinesList];
export default function Icons() {
  const [searchIcon, setSearchIcon] = useState<string>('');

  console.log(Object.entries(logos));

  return (
    <div className="relative flex justify-center w-full">
      <aside className="hidden lg:block flex-[0_10000_240px] sticky top-16 h-[calc(100vh-64px)] mr-auto overflow-auto py-4">
        <CustomizeIcon />
      </aside>
      <div className="relative flex-1 max-w-[1200px] pl-8">
        <div className={cn('sticky mt-10 mb-10')}>
          <input
            className={cn(
              'h-12 w-full px-4',
              'border border-border rounded-lg bg-secondary ',
              'focus:outline-none hover:border-peony-300',
            )}
            type="text"
            value={searchIcon}
            onChange={(e) => setSearchIcon(e.target.value)}
            placeholder="search for an icon..."
          />
        </div>
        <Tabs defaultValue="all" className="">
          <TabsList>
            <TabsTrigger value="all" className="text-md">
              All Icons
            </TabsTrigger>
            <TabsTrigger value="outline" className="text-md">
              Outline Icons
            </TabsTrigger>
            <TabsTrigger value="bold" className="text-md">
              Bold Icons
            </TabsTrigger>
            <TabsTrigger value="sharp" className="text-md">
              sharp Icons
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-md">
              brand Icons
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <section className="grid grid-cols-56 gap-3">
              <TooltipProvider delayDuration={100}>
                {allList.map((item, idx) => {
                  const name = item[0];
                  const Logo = item[1];
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="h-14 w-14 bg-secondary rounded-lg hover:bg-peony-100 dark:hover:bg-croci-600 cursor-pointer flex items-center justify-center">
                          <Logo className="w-6 h-6" key={idx} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </section>
          </TabsContent>
          <TabsContent value="outline">
            <section className="grid grid-cols-56 gap-3">
              <TooltipProvider delayDuration={100}>
                {outlinesList.map((item, idx) => {
                  const name = item[0];
                  const Logo = item[1];
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="h-14 w-14 bg-secondary rounded-lg hover:bg-peony-100 dark:hover:bg-croci-600 cursor-pointer flex items-center justify-center">
                          <Logo className="w-8 h-8" key={idx} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </section>
          </TabsContent>
          <TabsContent value="bold">
            <section className="grid grid-cols-56 gap-3">
              <TooltipProvider delayDuration={100}>
                {boldList.map((item, idx) => {
                  const name = item[0];
                  const Logo = item[1];
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="h-14 w-14 bg-secondary rounded-lg hover:bg-peony-100 dark:hover:bg-croci-600 cursor-pointer flex items-center justify-center">
                          <Logo className="w-6 h-6" key={idx} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </section>
          </TabsContent>
          <TabsContent value="sharp">
            <section className="grid grid-cols-56 gap-3">
              <TooltipProvider delayDuration={100}>
                {sharpList.map((item, idx) => {
                  const name = item[0];
                  const Logo = item[1];
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="h-14 w-14 bg-secondary rounded-lg hover:bg-peony-100 dark:hover:bg-croci-600 cursor-pointer flex items-center justify-center">
                          <Logo className="w-6 h-6" key={idx} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </section>
          </TabsContent>
          <TabsContent value="brand">
            <section className="grid grid-cols-56 gap-3">
              <TooltipProvider delayDuration={100}>
                {logoList.map((item, idx) => {
                  const name = item[0];
                  const Logo = item[1];
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="h-14 w-14 bg-secondary rounded-lg cursor-pointer flex items-center justify-center">
                          <Logo className="w-6 h-6" key={idx} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
