import { TaskStatus } from "atlas-core";
import figures from "figures";
import chalk, { ColorName, ModifierName } from "chalk";

interface StatusStyle {
  icon: string;
  iconColor: ColorName;
  lineColor?: ColorName;
  decoration?: ModifierName;
}

const styles: Map<TaskStatus, StatusStyle> = new Map<TaskStatus, StatusStyle>([
  [
    TaskStatus.Pending,
    { icon: figures.ellipsis, iconColor: "cyan", lineColor: "cyan" },
  ],
  [TaskStatus.Running, { icon: figures.play, iconColor: "magenta" }],
  [TaskStatus.Completed, { icon: figures.tick, iconColor: "green" }],
  [
    TaskStatus.Failed,
    { icon: figures.cross, iconColor: "red", lineColor: "red" },
  ],
  [
    TaskStatus.Skipped,
    {
      icon: figures.arrowDown,
      iconColor: "gray",
      lineColor: "gray",
      decoration: "strikethrough",
    },
  ],
]);

function _linePrefix(level: number): string {
  if (level === 0) return "";
  return "  ".repeat(level - 1) + "└─ ";
}

export function renderLine({
  line,
  status,
  level = 0,
}: {
  line: string;
  status: TaskStatus;
  level: number;
}): string {
  let style = styles.get(status);
  if (style === undefined) {
    throw new Error(`Unknown status ${status}`);
  }

  let result = chalk[style.iconColor](style.icon) + " " + line;
  if (style.lineColor) {
    result = chalk[style.lineColor](result);
  }
  if (style.decoration) {
    result = chalk[style.decoration](result);
  }

  return _linePrefix(level) + result;
}
