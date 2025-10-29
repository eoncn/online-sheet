import _ from "lodash";
import { Context, Sheet } from "..";
import {
  addSheet as addSheetInternal,
  deleteSheet as deleteSheetInternal,
  updateSheet as updateSheetInternal,
} from "../modules";
import { Settings } from "../settings";
import { CommonOptions, getSheet } from "./common";
import { INVALID_PARAMS } from "./errors";

export function addSheet(
  ctx: Context,
  settings?: Required<Settings>,
  newSheetID?: string,
  isPivotTable: boolean = false,
  sheetname: string | undefined = undefined,
  sheetData: Sheet | undefined = undefined
) {
  addSheetInternal(
    ctx,
    settings,
    newSheetID,
    isPivotTable,
    sheetname,
    sheetData
  );
}

export function deleteSheet(ctx: Context, options: CommonOptions = {}) {
  const sheet = getSheet(ctx, options);
  deleteSheetInternal(ctx, sheet.id!);
}

export function updateSheet(ctx: Context, data: Sheet[]) {
  updateSheetInternal(ctx, data);
}

export function activateSheet(ctx: Context, options: CommonOptions = {}) {
  const sheet = getSheet(ctx, options);
  ctx.currentSheetId = sheet.id!;
}

export function setSheetName(
  ctx: Context,
  name: string,
  options: CommonOptions = {}
) {
  const sheet = getSheet(ctx, options);
  sheet.name = name;
}

export function setSheetOrder(ctx: Context, orderList: Record<string, number>) {
  ctx.luckysheetfile?.forEach((sheet) => {
    if (sheet.id! in orderList) {
      sheet.order = orderList[sheet.id!];
    }
  });
  // re-order starting from 0
  _.sortBy(ctx.luckysheetfile, ["order"]).forEach((sheet, i) => {
    sheet.order = i;
  });
}

export function scroll(
  ctx: Context,
  scrollbarX: HTMLDivElement | null,
  scrollbarY: HTMLDivElement | null,
  options: {
    scrollLeft?: number;
    scrollTop?: number;
    targetRow?: number;
    targetColumn?: number;
  }
) {
  if (options.scrollLeft != null) {
    if (!_.isNumber(options.scrollLeft)) {
      throw INVALID_PARAMS;
    }
    if (scrollbarX) {
      scrollbarX.scrollLeft = options.scrollLeft;
    }
  } else if (options.targetColumn != null) {
    if (!_.isNumber(options.targetColumn)) {
      throw INVALID_PARAMS;
    }
    const col_pre =
      options.targetColumn <= 0
        ? 0
        : ctx.visibledatacolumn[options.targetColumn - 1];
    if (scrollbarX) {
      scrollbarX.scrollLeft = col_pre;
    }
  }

  if (options.scrollTop != null) {
    if (!_.isNumber(options.scrollTop)) {
      throw INVALID_PARAMS;
    }
    if (scrollbarY) {
      scrollbarY.scrollTop = options.scrollTop;
    }
  } else if (options.targetRow != null) {
    if (!_.isNumber(options.targetRow)) {
      throw INVALID_PARAMS;
    }
    const row_pre =
      options.targetRow <= 0 ? 0 : ctx.visibledatarow[options.targetRow - 1];

    if (scrollbarY) {
      scrollbarY.scrollTop = row_pre;
    }
  }
}

/**
 * 快速判断目标值是否在以逗号分隔的字符串列表中
 * @param listStr
 * @param target
 */
function existsInListFast(listStr: string, target: string): boolean {
  return (
    listStr === target ||
    listStr.startsWith(`${target},`) ||
    listStr.endsWith(`,${target}`) ||
    listStr.includes(`,${target},`)
  );
}

// function getBorderInfo(row: number, col: number) {
//   return {
//     rangeType: "cell",
//     value: {
//       row_index: row,
//       col_index: col,
//       l: {
//         style: 1,
//         color: "#FC0B28",
//       },
//       r: {
//         style: 1,
//         color: "#FC0B28",
//       },
//       t: {
//         style: 1,
//         color: "#FC0B28",
//       },
//       b: {
//         style: 1,
//         color: "#FC0B28",
//       },
//     },
//   };
// }

/**
 * 给定行号，以及列号，返回对应的列字母表示
 */
function getColumnLetter(col: number): string {
  let letter = "";
  while (col >= 0) {
    letter = String.fromCharCode((col % 26) + 65) + letter;
    col = Math.floor(col / 26) - 1;
  }
  return letter;
}

/**
 * 验证所有表格数据合法性
 */
export function validate(
  ctx: Context
): Promise<{ success: boolean; message: string }> {
  for (let i = 0; i < ctx.luckysheetfile.length; i += 1) {
    const sheet = ctx.luckysheetfile[i];
    const { data, dataVerification } = sheet;
    // 没有数据或没有设置数据校验规则则跳过
    if (!data || !dataVerification) {
      continue;
    }
    // sheet.config = {
    //   borderInfo: [],
    // };
    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < data[r].length; c += 1) {
        const cell = data[r][c];
        if (cell == null) {
          continue;
        }
        const item = dataVerification[`${r}_${c}`];
        if (!item || item.type !== "dropdown") {
          continue;
        }
        // 获取当前单元格的值
        if (
          typeof cell.v !== "string" &&
          typeof cell.v !== "number" &&
          typeof cell.v !== "boolean"
        ) {
          continue;
        }
        const value = cell.v.toString();
        if (value === "" || value.trim() === "") {
          continue;
        }
        const { type2, value1: valueListString } = item;
        // 多选的情况，不检查
        if (type2) {
          continue;
        }
        // console.log("valueListString", valueListString, value);
        // 单选的情况，检查值是否在下拉列表中
        if (existsInListFast(valueListString, value)) {
          // 列表中存在
          continue;
        }
        // // 修改单元格边框颜色为红色，提示数据不合法
        // sheet.config = {
        //   borderInfo: [getBorderInfo(r, c)],
        // };
        // console.log("验证不通过", sheet.name, r, c, value);
        const sheetName =
          ctx.luckysheetfile.length > 1 ? `表【${sheet.name}】中` : "";
        const cellName = getColumnLetter(c);
        return Promise.resolve({
          success: false,
          message: `${sheetName}单元格${cellName}${
            r + 1
          }的值【${value}】不在下拉列表中`,
        });
      }
    }
  }
  return Promise.resolve({ success: true, message: "验证通过" });
}
