import React, { useCallback, useRef, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Workbook, WorkbookInstance } from "@jadinec/react-sheet";
import { Sheet } from "@jadinec/core-sheet";
import dataVerification from "./data/dataVerification";
import "@jadinec/react-sheet/dist/index.css";
import "antd/es/select/style/index.css"; // 必须手动引入 CSS

export default {
  component: Workbook,
} as Meta<typeof Workbook>;

const ApiExecContainer: React.FC<{
  onRun: () => any;
  children?: React.ReactNode;
}> = ({ children, onRun }) => {
  const [result, setResult] = useState<string>();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <div style={{ flexShrink: 0, padding: 8 }}>
        <button
          type="button"
          onClick={() => {
            setResult(onRun?.());
          }}
          tabIndex={0}
        >
          Run
        </button>
        <span style={{ marginLeft: 16 }}>
          {result && (
            <>
              <span style={{ color: "#aaa" }}>result: </span> {result}
            </>
          )}
        </span>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export const GetCellValue: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([dataVerification]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setCellOptions(1, 0, [
          { label: "v1", value: "fortune1" },
          { label: "m2", value: "fortune2" },
          { label: "bg", value: "green3" },
          { label: "ct", value: "123444" },
          { label: "qp", value: "fortune5" },
          { label: "spl", value: "fortune6" },
          { label: "lo", value: "fortune7" },
          { label: "rt", value: "fortune8" },
          { label: "ps", value: "fortune9" },
          { label: "hl", value: "fortune10" },
          { label: "2", value: "33333" },
        ]);
      }}
    >
      <Workbook
        ref={ref}
        data={data}
        onChange={onChange}
        // rowHeaderWidth={150}
        columnHeaderHeight={25}
        defaultColWidth={150}
        defaultRowHeight={20}
        defaultFontSize={10}
        showToolbar={false}
        showFormulaBar={false}
        showSheetTabs={false}
        addRows={0}
        forceCalculation={false}
        cellEditable={(row, column) => {
          // 只允许编辑第0行第0列
          // return row === 0 && column === 0;
          return true;
        }}
        beforeDeleteRow={() => {
          return Promise.resolve(false);
        }}
        selectClick={(row, column) => {
          console.log("selectClick", row, column);
          if (row === 1) {
            console.log("selectClick", row, column);
            const ret: { lable: string; value: string }[] = [];
            for (let i = 0; i < 25000; i = i + 1) {
              ret.push({
                label: `这是一个测试数据${i}`,
                value: `option-${i}`,
              });
            }
            // 显示loading状态
            // 模拟异步请求
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(ret);
              }, 0);
            });
          }
          return Promise.resolve([]);
        }}
      />
    </ApiExecContainer>
  );
};

export const SetCellValue: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setCellOptions(0, 1, [
          { label: "v1", value: "fortune1" },
          { label: "m2", value: "fortune2" },
          { label: "bg", value: "green3" },
          { label: "ct", value: "123444" },
          { label: "qp", value: "fortune5" },
          { label: "spl", value: "fortune6" },
          { label: "lo", value: "fortune7" },
          { label: "rt", value: "fortune8" },
          { label: "ps", value: "fortune9" },
          { label: "hl", value: "fortune10" },
          { label: "2", value: "33333" },
        ]);
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const ClearCell: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { bg: "green", v: "fortune", m: "fortune" } },
      ],
      order: 0,
      row: 1,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.clearCell(0, 0);
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetCellFormat: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "set bg = green" } }],
      order: 0,
      row: 1,
      column: 1,
      config: { columnlen: { "0": 120 } },
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setCellFormat(0, 0, "bg", "red");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const AutoFillCell: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { m: "1", v: 1, ct: { t: "n", fa: "General" } } },
        { r: 0, c: 1, v: { m: "2", v: 2, ct: { t: "n", fa: "General" } } },
        { r: 1, c: 0, v: { m: "2", v: 2, ct: { t: "n", fa: "General" } } },
        { r: 1, c: 1, v: { m: "4", v: 4, ct: { t: "n", fa: "General" } } },
      ],
      order: 0,
      row: 10,
      column: 2,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.autoFillCell(
          { row: [0, 1], column: [0, 1] },
          { row: [2, 9], column: [0, 1] },
          "down"
        );
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const Freeze: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.freeze("both", { row: 3, column: 3 });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const InsertRowCol: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "original" } }],
      order: 0,
      row: 1,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.insertRowOrColumn("row", 0, 1);
        ref.current?.setCellValue(1, 0, "inserted1");
        ref.current?.insertRowOrColumn("column", 0, 1);
        ref.current?.setCellValue(0, 1, "inserted2");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const DeleteRowCol: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
        { r: 2, c: 0, v: { v: "2" } },
        { r: 3, c: 0, v: { v: "3" } },
        { r: 4, c: 0, v: { v: "4" } },
      ],
      order: 0,
      row: 5,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.deleteRowOrColumn("row", 1, 3);
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const GetRowHeight: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      config: { rowlen: { 2: 200 } },
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
        { r: 2, c: 0, v: { v: "2" } },
        { r: 3, c: 0, v: { v: "3" } },
        { r: 4, c: 0, v: { v: "4" } },
      ],
      order: 0,
      row: 5,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.getRowHeight([0, 1, 2, 3, 4]));
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const GetColumnWidth: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      config: { columnlen: { 2: 200 } },
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
        { r: 0, c: 2, v: { v: "2" } },
        { r: 0, c: 3, v: { v: "3" } },
        { r: 0, c: 4, v: { v: "4" } },
      ],
      order: 0,
      row: 1,
      column: 5,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.getColumnWidth([0, 1, 2, 3, 4]));
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetRowHeight: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
        { r: 2, c: 0, v: { v: "height = 100" } },
        { r: 3, c: 0, v: { v: "3" } },
        { r: 4, c: 0, v: { v: "4" } },
      ],
      order: 0,
      row: 5,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setRowHeight({ "2": 100 });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const HideRow: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
        { r: 2, c: 0, v: { v: "hide this!" } },
        { r: 3, c: 0, v: { v: "3" } },
        { r: 4, c: 0, v: { v: "4" } },
      ],
      order: 0,
      row: 5,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.hideRowOrColumn(["2"], "row");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const ShowRow: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
        { r: 2, c: 0, v: { v: "show this" } },
        { r: 3, c: 0, v: { v: "3" } },
        { r: 4, c: 0, v: { v: "4" } },
      ],
      config: {
        rowhidden: {
          "2": 0,
        },
      },
      order: 0,
      row: 5,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.showRowOrColumn(["2"], "row");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetColumnWidth: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
        { r: 0, c: 2, v: { v: "width = 200" } },
        { r: 0, c: 3, v: { v: "3" } },
        { r: 0, c: 4, v: { v: "4" } },
      ],
      order: 0,
      row: 1,
      column: 5,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setColumnWidth({ "2": 200 });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const GetSelection: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      luckysheet_select_save: [{ row: [0, 1], column: [1, 2] }],
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
        { r: 0, c: 2, v: { v: "2" } },
        { r: 0, c: 3, v: { v: "3" } },
        { r: 0, c: 4, v: { v: "4" } },
        { r: 1, c: 0, v: { v: "0" } },
        { r: 1, c: 1, v: { v: "1" } },
        { r: 1, c: 2, v: { v: "2" } },
        { r: 1, c: 3, v: { v: "3" } },
        { r: 1, c: 4, v: { v: "4" } },
      ],
      order: 0,
      row: 2,
      column: 5,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.getSelection());
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetSelection: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
        { r: 0, c: 2, v: { v: "2" } },
        { r: 0, c: 3, v: { v: "3" } },
        { r: 0, c: 4, v: { v: "4" } },
        { r: 1, c: 0, v: { v: "0" } },
        { r: 1, c: 1, v: { v: "1" } },
        { r: 1, c: 2, v: { v: "2" } },
        { r: 1, c: 3, v: { v: "3" } },
        { r: 1, c: 4, v: { v: "4" } },
      ],
      order: 0,
      row: 2,
      column: 5,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setSelection([{ row: [0, 1], column: [1, 2] }]);
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const MergeCells: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
        { r: 0, c: 2, v: { v: "2" } },
        { r: 0, c: 3, v: { v: "3" } },
        { r: 0, c: 4, v: { v: "4" } },
        { r: 1, c: 0, v: { v: "0" } },
        { r: 1, c: 1, v: { v: "1" } },
        { r: 1, c: 2, v: { v: "2" } },
        { r: 1, c: 3, v: { v: "3" } },
        { r: 1, c: 4, v: { v: "4" } },
      ],
      order: 0,
      row: 2,
      column: 5,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.mergeCells([{ row: [0, 1], column: [1, 2] }], "merge-all");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const GetAllSheets: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 0, c: 1, v: { v: "1" } },
      ],
      order: 0,
      row: 1,
      column: 2,
    },
    {
      name: "Sheet2",
      celldata: [
        { r: 0, c: 0, v: { v: "0" } },
        { r: 1, c: 0, v: { v: "1" } },
      ],
      order: 1,
      row: 2,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.getAllSheets());
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const AddSheet: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      id: "1",
      name: "Sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "1" } }],
      order: 0,
      row: 1,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.addSheet();
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const DeleteSheet: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      id: "1",
      name: "Sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "1" } }],
      order: 0,
      row: 1,
      column: 1,
    },
    {
      id: "2",
      name: "Sheet2",
      celldata: [{ r: 0, c: 0, v: { v: "2" } }],
      order: 1,
      row: 1,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.deleteSheet({ id: "2" });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const UpdateSheet: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      id: "1",
      name: "sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "1" } }],
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        // 更新样例
        ref.current?.updateSheet([
          {
            id: "1",
            name: "lvjing",
            data: [[{ v: "1" }]],
            order: 0,
            row: 10,
            column: 20,
            luckysheet_select_save: [
              {
                row: [2, 4],
                column: [4, 6],
                column_focus: 6,
                height: 19,
                height_move: 59,
                left: 444,
                left_move: 296,
                row_focus: 4,
                top: 80,
                top_move: 40,
                width: 73,
                width_move: 221,
              },
            ],
          },
          {
            id: "2",
            name: "lvjing2",
            data: [[{ v: "12" }, { v: "lvjing" }]],
            order: 1,
          },
          {
            id: "3",
            name: "lvjing3",
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: "1",
                  ct: {
                    fa: "General",
                    t: "n",
                  },
                  m: "1",
                },
              },
              {
                r: 1,
                c: 0,
                v: {
                  mc: {
                    r: 1,
                    c: 0,
                    rs: 2,
                    cs: 2,
                  },
                },
              },
              {
                r: 1,
                c: 1,
                v: {
                  mc: {
                    r: 1,
                    c: 0,
                  },
                },
              },
              {
                r: 2,
                c: 0,
                v: {
                  mc: {
                    r: 1,
                    c: 0,
                  },
                },
              },
              {
                r: 2,
                c: 1,
                v: {
                  mc: {
                    r: 1,
                    c: 0,
                  },
                },
              },
            ],
            row: 20,
            column: 20,
            order: 3,
          },
        ]);
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const ActivateSheet: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      id: "1",
      name: "Sheet1",
      celldata: [{ r: 0, c: 0, v: { v: "1" } }],
      order: 0,
      row: 1,
      column: 1,
    },
    {
      id: "2",
      name: "Sheet2",
      celldata: [{ r: 0, c: 0, v: { v: "2" } }],
      order: 1,
      row: 1,
      column: 1,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.activateSheet({ id: "2" });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetSheetName: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setSheetName("Fortune");
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const SetSheetOrder: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    { id: "1", name: "Sheet1", order: 0 },
    { id: "2", name: "Sheet2", order: 1 },
    { id: "3", name: "Sheet3", order: 2 },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.setSheetOrder({
          "1": 3,
          "2": 1,
          "3": 2,
        });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const Scroll: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.scroll({
          targetColumn: 12,
        });
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const Undo: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.handleUndo());
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

export const Redo: StoryFn<typeof Workbook> = () => {
  const ref = useRef<WorkbookInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      order: 0,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <ApiExecContainer
      onRun={() => {
        return JSON.stringify(ref.current?.handleRedo());
      }}
    >
      <Workbook ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};
