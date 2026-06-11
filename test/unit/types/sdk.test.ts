import { describe, it, expect } from 'vitest';
import type {
  AGenUIComponent,
  ChildList,
  Action,
  DynamicString,
} from '../../../src/types/sdk';

describe('AGenUIComponent — A2UI v0.9 compliance', () => {
  it('uses "component" field instead of "type"', () => {
    const comp: AGenUIComponent = {
      id: 'txt-1',
      component: 'Text',
      text: 'Hello',
    };
    expect(comp.component).toBe('Text');
  });

  it('container components use "children" with ComponentId array', () => {
    const col: AGenUIComponent = {
      id: 'root',
      component: 'Column',
      children: ['child-1', 'child-2'],
    };
    expect(col.children).toEqual(['child-1', 'child-2']);
  });

  it('single-child containers use "child"', () => {
    const card: AGenUIComponent = {
      id: 'card-1',
      component: 'Card',
      child: 'card-body',
    };
    expect(card.child).toBe('card-body');
  });

  it('template children use path + componentId', () => {
    const list: AGenUIComponent = {
      id: 'list-1',
      component: 'List',
      children: { path: '/items', componentId: 'item-template' },
    };
    const childList = list.children as ChildList;
    if (typeof childList === 'object' && !Array.isArray(childList)) {
      expect(childList.path).toBe('/items');
      expect(childList.componentId).toBe('item-template');
    }
  });

  it('action uses event with name and context', () => {
    const btn: AGenUIComponent = {
      id: 'btn-1',
      component: 'Button',
      child: 'btn-label',
      action: {
        event: {
          name: 'submit_form',
          context: { formId: 'f1' },
        },
      },
    };
    expect(btn.action?.event?.name).toBe('submit_form');
  });

  it('action uses functionCall for local actions', () => {
    const btn: AGenUIComponent = {
      id: 'btn-2',
      component: 'Button',
      child: 'btn-label',
      action: {
        functionCall: {
          call: 'openUrl',
          args: { url: 'https://example.com' },
        },
      },
    };
    expect(btn.action?.functionCall?.call).toBe('openUrl');
  });

  it('DynamicString accepts literal or path binding', () => {
    const literal: DynamicString = 'Hello';
    const bound: DynamicString = { path: '/user/name' };
    const func: DynamicString = { call: 'formatString', args: { value: 'Hi ${/name}' } };
    expect(literal).toBe('Hello');
    expect(bound).toEqual({ path: '/user/name' });
    expect(func).toEqual({ call: 'formatString', args: { value: 'Hi ${/name}' } });
  });
});
