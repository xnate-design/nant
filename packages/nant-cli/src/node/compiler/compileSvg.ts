/**
 * complier svg to react
 */

import { parse, ElementNode } from 'svg-parser';
import svgo from 'svgo';

interface TransformOptions {
  [key: string]: string;
}

class SvgTransform {
  size: string | number | null | undefined;
  options: TransformOptions = {};
  width: number | string | undefined;
  height: number | string | undefined;
  fill: string | null | undefined;
  extraProps = '';
  cleaned = '';
  start = async (svg: any, options = {}) => {
    this.options = options;
    const cleaned = this.clean(svg);
    if (!cleaned || cleaned === '') return '';
    const {
      children: [node],
    } = parse(cleaned);
    const transformed = this.transform(node as ElementNode);
    const structured = this.structure(transformed);
    // const formatted = await this.format(structured);
    const replaced = this.replace(structured);
    return replaced;
  };
  clean = (svg: any) => {
    const plugins: svgo.PluginConfig[] = [
      'cleanupAttrs', // 清除换行符、尾随和重复空格的属性
      'mergeStyles', // 将多个样式元素合并为一个
      'removeDoctype', //删除doctype声明
      'removeXMLProcInst', //删除 XML 处理指令
      'removeComments', //删除评论
      'removeMetadata', //删除<metadata>
      'removeMetadata', //删除<metadata>
      'removeTitle', //删除<metadata>
      'removeDesc', //删除<desc>
      // "removeEditorsNSData", //删除编辑器命名空间、元素和属性
      // "removeHiddenElems", // 删除隐藏元素
      // "removeEmptyText", // 删除空的文本元素
      // "removeEmptyContainers", // 移除空的 Container 元素
      // "removeViewBox", // 尽可能删除viewBox属性
      // "cleanupEnableBackground", // 尽可能删除或清理enable-background属性
      // "convertColors", // 转换颜色 rgb() 转化为 #rrggbb
      'convertPathData', // 将路径数据转换为相对或绝对数据（以较短者为准），将一段转换为另一段，修剪无用的分隔符，智能舍入等等
      'convertTransform', // 将多个转换合并为一个，将矩阵转换为短别名等等
      'removeUnknownsAndDefaults', // 移除未知元素内容和属性，移除具有默认值的属性
      'removeNonInheritableGroupAttrs', //删除不可继承组的“表示”属性
      'removeUselessStrokeAndFill', //删除无用stroke和fill属性
      'removeUnusedNS', //删除未使用的命名空间声明
      'cleanupIds', //删除未使用的并缩小使用的 ID
      'cleanupNumericValues', //将数值四舍五入到固定精度，删除默认px单位
      'moveElemsAttrsToGroup', //将元素的属性移动到它们的封闭组
      'moveGroupAttrsToElems', //将一些组属性移动到包含的元素
      'mergePaths', //将多个路径合并为一个
      'convertShapeToPath', //将一些基本形状转换为<path>
      'convertEllipseToCircle', //将非偏心转换<ellipse>为<circle>
      'sortDefsChildren', //排序子<defs>级以提高压缩率
      'removeUselessDefs', //删除没用的<defs>
      'removeXMLNS', //删除xmlns属性
      'minifyStyles', // 使用CSSO缩小<style>元素内容
      'removeEmptyAttrs', // 删除空属性
      'collapseGroups', //折叠无用的组
      'inlineStyles', // 将样式从<style>元素移动和合并到元素style属性 有bug
      'convertStyleToAttrs', // 将样式转换为属性
    ];
    svg = svg.replaceAll('mix-blend-mode:passthrough', '');
    const cleaned = svgo.optimize(svg, {
      multipass: true, // boolean. false by default
      plugins: [
        {
          name: 'prefixIds',
          params: {
            delim: '_dxc-svg-to-react_',
          },
        },
        ...plugins,
      ],
    });
    this.cleaned = cleaned.data as string;
    return cleaned.data;
  };
  transform = ({ tagName, properties, children }: ElementNode): string => {
    const props = this.getProps(properties, tagName);
    let jsx = `<${tagName} ${props}`;
    if (children.length !== 0) {
      jsx += '>';
      children.forEach((row) => {
        jsx += '\n';
        if (typeof row === 'string') {
          jsx += '{`' + row + '`}';
        } else if (row.type === 'text') {
          jsx += '{`' + row.value + '`}';
        } else {
          jsx += this.transform(row);
        }
      });
      jsx += `</${tagName}>`;
    } else {
      jsx += '/>\n';
    }
    return jsx;
  };
  getProps = (properties: Record<string, string | number> | undefined, tagName: string | undefined) => {
    const propsArr = [];
    let props;
    if (tagName === 'svg' && typeof properties === 'object') {
      const { width = '1.33em', height = '1.33em', ...other } = properties;
      if (width) {
        if (width === height) {
          this.size = width;
          propsArr.push(`width='1.33em'`);
          propsArr.push(`height='1.33em'`);
        } else {
          this.width = width;
          this.height = height;
          propsArr.push(`width='1.33em'`);
          propsArr.push(`height='1.33em'`);
        }
      }
      propsArr.push(`fill="currentColor"`);
      props = other;
    } else {
      props = properties;
    }

    for (const key in props) {
      if (key === 'fill' && props[key] !== 'none') {
        if (props[key] === '') {
          props[key] = 'emptyFill';
        }
        if (!this.fill) {
          this.fill = `${props[key]}`;
        } else if (this.fill !== props[key]) {
          this.fill = null;
        }
      }
      if (key === 'class' || key === 'className') {
        const str = props[key] ?? '';
        const regExp = new RegExp(`${str}`, 'gim');
        const regList = this.cleaned.match(regExp) || [];
        if (regList.length === 1) {
          continue;
        }
      }

      if (key === 'stroke') {
        props[key] = 'currentColor';
      }
      //   str.match(/ab/igm).length
      propsArr.push(`${this.transformKey(key)}="${props[key]}"`);
    }
    if (tagName === 'svg') {
      propsArr.push(`{...ExtraProps}`);
    }
    return propsArr.join(' ');
  };
  transformKey = (key: string) => {
    if (key === 'class') return 'className';
    return this.toCamelCase(key);
  };
  structure = (src: string): string => {
    const propsArr = [];
    if (this.size) {
      // propsArr.push(`size="${this.size}"`);
    }
    if (this.width) {
      propsArr.push(`width="${this.width}"`);
    }
    if (this.height) {
      propsArr.push(`height="${this.height}"`);
    }
    if (this.fill) {
      propsArr.push(`fill="fillVal"`);
    }
    let props = '';
    if (propsArr.length !== 0) {
      propsArr.push('...other');
      props = `{${propsArr.join(',')}}`;
      this.extraProps = 'other';
      //   src = src.replace("ExtraProps", "...other");
    } else {
      props = 'props';
      this.extraProps = 'props';
    }
    return `
import React from 'react';
export const ${this.options.name} = (${props}) => {
  return ${src};
};
`;
  };
  toCamelCase = (str: string) => {
    const pattern = /-([a-z])/g;
    return str.replace(pattern, function (all, letter) {
      return letter.toUpperCase();
    });
  };
  replace = (src: string) => {
    src = src.replace('ExtraProps', this.extraProps).replaceAll('prefix_dxc-svg-to-react_', '');
    if (this.fill) {
      src = src.replaceAll(`"${this.fill}"`, '{fill}');
      src = src.replace(`fillVal`, this.fill === 'emptyFill' ? '' : this.fill);
    }
    return src;
  };
}

export default new SvgTransform();
