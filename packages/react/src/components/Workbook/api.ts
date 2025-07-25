import {
  addSheet,
  api,
  Cell,
  Context,
  deleteRowCol,
  deleteSheet,
  insertRowCol,
  Op,
  opToPatch,
  Range,
  Selection,
  Presence,
  Settings,
  SingleRange,
  createFilterOptions,
  getSheetIndex,
  Sheet,
  CellMatrix,
  CellWithRowAndCol,
} from "@jadinec/core-sheet";
import { applyPatches } from "immer";
import _ from "lodash";
import { SetContextOptions } from "../../context";

export function generateAPIs(
  context: Context,
  setContext: (
    recipe: (ctx: Context) => void,
    options?: SetContextOptions
  ) => void,
  handleUndo: () => void,
  handleRedo: () => void,
  settings: Required<Settings>,
  cellInput: HTMLDivElement | null,
  scrollbarX: HTMLDivElement | null,
  scrollbarY: HTMLDivElement | null
) {
  type ApiCall = {
    name: string;
    args: any[];
  };
  return {
    applyOp: (ops: Op[]) => {
      setContext(
        (ctx_) => {
          const [patches, specialOps] = opToPatch(ctx_, ops);
          if (specialOps.length > 0) {
            const [specialOp] = specialOps;
            if (specialOp.op === "insertRowCol") {
              try {
                insertRowCol(ctx_, specialOp.value, false);
              } catch (e: any) {
                console.error(e);
              }
            } else if (specialOp.op === "deleteRowCol") {
              deleteRowCol(ctx_, specialOp.value);
            } else if (specialOp.op === "addSheet") {
              const name = patches.filter(
                (path) => path.path[0] === "name"
              )?.[0]?.value;
              if (specialOp.value?.id) {
                addSheet(
                  ctx_,
                  settings,
                  specialOp.value.id,
                  false,
                  name,
                  specialOp.value
                );
              }
              // 添加addSheet完后，给sheet初始化data
              const fileIndex = getSheetIndex(
                ctx_,
                specialOp.value.id
              ) as number;
              api.initSheetData(ctx_, fileIndex, specialOp.value);
            } else if (specialOp.op === "deleteSheet") {
              deleteSheet(ctx_, specialOp.value.id);
              patches.length = 0;
            }
          }
          if (ops[0]?.path?.[0] === "filter_select")
            ctx_.luckysheet_filter_save = ops[0].value;
          else if (ops[0]?.path?.[0] === "hide") {
            //  hide sheet
            if (ctx_.currentSheetId === ops[0].id) {
              const shownSheets = ctx_.luckysheetfile.filter(
                (sheet) =>
                  (_.isUndefined(sheet.hide) || sheet?.hide !== 1) &&
                  sheet.id !== ops[0].id
              );
              ctx_.currentSheetId = _.sortBy(
                shownSheets,
                (sheet) => sheet.order
              )[0].id as string;
            }
          }
          createFilterOptions(ctx_, ctx_.luckysheet_filter_save, ops[0]?.id);
          if (patches.length === 0) return;
          try {
            applyPatches(ctx_, patches);
          } catch (e) {
            console.error(e);
          }
        },
        { noHistory: true }
      );
    },

    getCellValue: (
      row: number,
      column: number,
      options: api.CommonOptions & { type?: keyof Cell } = {}
    ) => api.getCellValue(context, row, column, options),

    setCellValue: (
      row: number,
      column: number,
      value: any,
      options: api.CommonOptions & { type?: keyof Cell } = {}
    ) =>
      setContext((draftCtx) =>
        api.setCellValue(draftCtx, row, column, value, cellInput, options)
      ),

    setCellOptions: (
      row: number,
      column: number,
      list: { label: string; value: string; extra?: any }[],
      options: api.CommonOptions & { type?: keyof Cell } = {}
    ) => {
      setContext((draftCtx) =>
        api.setCellOptions(draftCtx, row, column, list, options)
      );
      // setContext(async (ctx) => {
      //   console.log("setCellOptions", row, column, options);
      //   // 获取原来的下拉列表
      //   const i = getSheetIndex(ctx, ctx.currentSheetId) as number;
      //   const { dataVerification: verification } = ctx.luckysheetfile[i];
      //   const cellItem = verification[`${row}_${column}`];
      //   cellItem.value1 = options.map((child) => child.label).join(",");
      //   try {
      //     cellItem.value2 = JSON.stringify(options);
      //   } catch (e) {
      //     console.error("JSON.stringify error", e);
      //     cellItem.value2 = "[]";
      //   }
      // });
    },

    clearCell: (row: number, column: number, options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.clearCell(draftCtx, row, column, options)),

    setCellFormat: (
      row: number,
      column: number,
      attr: keyof Cell,
      value: any,
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) =>
        api.setCellFormat(draftCtx, row, column, attr, value, options)
      ),

    autoFillCell: (
      copyRange: SingleRange,
      applyRange: SingleRange,
      direction: "up" | "down" | "left" | "right"
    ) =>
      setContext((draftCtx) =>
        api.autoFillCell(draftCtx, copyRange, applyRange, direction)
      ),

    freeze: (
      type: "row" | "column" | "both",
      range: { row: number; column: number },
      options: api.CommonOptions = {}
    ) => setContext((draftCtx) => api.freeze(draftCtx, type, range, options)),

    insertRowOrColumn: (
      type: "row" | "column",
      index: number,
      count: number,
      direction: "lefttop" | "rightbottom" = "rightbottom",
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) =>
        api.insertRowOrColumn(draftCtx, type, index, count, direction, options)
      ),

    deleteRowOrColumn: (
      type: "row" | "column",
      start: number,
      end: number,
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) =>
        api.deleteRowOrColumn(draftCtx, type, start, end, options)
      ),

    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") =>
      setContext((draftCtx) =>
        api.hideRowOrColumn(draftCtx, rowOrColInfo, type)
      ),

    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") =>
      setContext((draftCtx) =>
        api.showRowOrColumn(draftCtx, rowOrColInfo, type)
      ),

    setRowHeight: (
      rowInfo: Record<string, number>,
      options: api.CommonOptions = {},
      custom: boolean = false
    ) =>
      setContext((draftCtx) =>
        api.setRowHeight(draftCtx, rowInfo, options, custom)
      ),

    setColumnWidth: (
      columnInfo: Record<string, number>,
      options: api.CommonOptions = {},
      custom: boolean = false
    ) =>
      setContext((draftCtx) =>
        api.setColumnWidth(draftCtx, columnInfo, options, custom)
      ),

    getRowHeight: (rows: number[], options: api.CommonOptions = {}) =>
      api.getRowHeight(context, rows, options),

    getColumnWidth: (columns: number[], options: api.CommonOptions = {}) =>
      api.getColumnWidth(context, columns, options),

    getSelection: () => api.getSelection(context),

    getFlattenRange: (range: Range) => api.getFlattenRange(context, range),

    getCellsByFlattenRange: (range?: { r: number; c: number }[]) =>
      api.getCellsByFlattenRange(context, range),

    getSelectionCoordinates: () => api.getSelectionCoordinates(context),

    getCellsByRange: (range: Selection, options: api.CommonOptions = {}) =>
      api.getCellsByRange(context, range, options),

    getHtmlByRange: (range: Range, options: api.CommonOptions = {}) =>
      api.getHtmlByRange(context, range, options),

    setSelection: (range: Range, options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.setSelection(draftCtx, range, options)),

    setCellValuesByRange: (
      data: any[][],
      range: SingleRange,
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) =>
        api.setCellValuesByRange(draftCtx, data, range, cellInput, options)
      ),

    setCellFormatByRange: (
      attr: keyof Cell,
      value: any,
      range: Range | SingleRange,
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) =>
        api.setCellFormatByRange(draftCtx, attr, value, range, options)
      ),

    mergeCells: (
      ranges: Range,
      type: string,
      options: api.CommonOptions = {}
    ) =>
      setContext((draftCtx) => api.mergeCells(draftCtx, ranges, type, options)),

    cancelMerge: (ranges: Range, options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.cancelMerge(draftCtx, ranges, options)),

    getAllSheets: () => api.getAllSheets(context),

    getSheet: (options: api.CommonOptions = {}) =>
      api.getSheetWithLatestCelldata(context, options),

    addSheet: (sheetId?: string) => {
      const existingSheetIds = api
        .getAllSheets(context)
        .map((sheet) => sheet.id || "");
      if (sheetId && existingSheetIds.includes(sheetId)) {
        console.error(
          `Failed to add new sheet: A sheet with the id "${sheetId}" already exists. Please use a unique sheet id.`
        );
      } else {
        setContext((draftCtx) => api.addSheet(draftCtx, settings, sheetId));
      }
    },

    deleteSheet: (options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.deleteSheet(draftCtx, options)),

    updateSheet: (data: Sheet[]) =>
      setContext((draftCtx) => api.updateSheet(draftCtx, data)),

    activateSheet: (options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.activateSheet(draftCtx, options)),

    setSheetName: (name: string, options: api.CommonOptions = {}) =>
      setContext((draftCtx) => api.setSheetName(draftCtx, name, options)),

    setSheetOrder: (orderList: Record<string, number>) =>
      setContext((draftCtx) => api.setSheetOrder(draftCtx, orderList)),

    scroll: (options: {
      scrollLeft?: number;
      scrollTop?: number;
      targetRow?: number;
      targetColumn?: number;
    }) => api.scroll(context, scrollbarX, scrollbarY, options),

    addPresences: (newPresences: Presence[]) => {
      setContext((draftCtx) => {
        draftCtx.presences = _.differenceBy(
          draftCtx.presences || [],
          newPresences,
          (v) => (v.userId == null ? v.username : v.userId)
        ).concat(newPresences);
      });
    },

    removePresences: (
      arr: {
        username: string;
        userId?: string;
      }[]
    ) => {
      setContext((draftCtx) => {
        if (draftCtx.presences != null) {
          draftCtx.presences = _.differenceBy(draftCtx.presences, arr, (v) =>
            v.userId == null ? v.username : v.userId
          );
        }
      });
    },

    handleUndo,
    handleRedo,

    calculateFormula: (id?: string, range?: SingleRange) => {
      setContext((draftCtx) => {
        api.calculateFormula(draftCtx, id, range);
      });
    },

    dataToCelldata: (data: CellMatrix | undefined) => {
      return api.dataToCelldata(data);
    },

    celldataToData: (
      celldata: CellWithRowAndCol[],
      rowCount?: number,
      colCount?: number
    ) => {
      return api.celldataToData(celldata, rowCount, colCount);
    },

    batchCallApis: (apiCalls: ApiCall[]) => {
      setContext((draftCtx) => {
        apiCalls.forEach((apiCall) => {
          const { name, args } = apiCall;
          if (typeof (api as any)[name] === "function") {
            (api as any)[name](draftCtx, ...args);
          } else {
            console.warn(`API ${name} does not exist`);
          }
        });
      });
    },
  };
}
