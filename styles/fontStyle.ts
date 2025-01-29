import {colorStyle} from './colorStyle';

export const fontStyle = {
  heading1: {
    // 主标题
    fontSize: 32,
    fontWeight: 'bold',
    color: colorStyle.textPrimary,
  },
  heading2: {
    // 副标题
    fontSize: 24,
    fontWeight: 'bold',
    color: colorStyle.textSecondary,
  },
  subheading: {
    // 小标题
    fontSize: 20,
    fontWeight: '600',
    color: colorStyle.textPrimary,
  },
  bodyLarge: {
    // 大号正文
    fontSize: 18,
    fontWeight: 'normal',
    color: colorStyle.textPrimary,
  },
  bodyMedium: {
    // 中号正文
    fontSize: 16,
    fontWeight: 'normal',
    color: colorStyle.textPrimary,
  },
  bodySmall: {
    // 小号正文
    fontSize: 14,
    fontWeight: 'normal',
    color: colorStyle.textSecondary,
  },
  caption: {
    // 字幕/图片描述
    fontSize: 12,
    fontWeight: 'normal',
    color: colorStyle.neutral500,
  },
  buttonText: {
    // 按钮文本
    fontSize: 16,
    fontWeight: 'bold',
    color: colorStyle.white,
  },
  linkText: {
    // 链接文本
    fontSize: 16,
    fontWeight: 'normal',
    color: colorStyle.link,
  },
  errorText: {
    // 错误信息
    fontSize: 14,
    fontWeight: 'normal',
    color: colorStyle.danger,
  },
  successText: {
    // 成功信息
    fontSize: 14,
    fontWeight: 'normal',
    color: colorStyle.success,
  },
  disabledText: {
    // 禁用文本
    fontSize: 16,
    fontWeight: 'normal',
    color: colorStyle.textMuted,
  },
} as const;
