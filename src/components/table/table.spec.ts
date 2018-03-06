import { flush, render } from '@stencil/core/testing';
import { Table } from './table';
import { TableCell } from '../table-cell/table-cell';

describe('gx-table', () => {
  it('should build', () => {
    expect(new Table()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    const cell0 = "cell0";
    const cell1 = "cell1";

    beforeEach(async () => {
      Table["is"] = "gx-table";
      TableCell["is"] = "gx-table-cell";
      element = await render({
        components: [Table, TableCell],
        html:   `<gx-table>
                  <gx-table-cell area="cell0">Cell1</gx-table-cell>
                  <gx-table-cell area="cell1">Cell2</gx-table-cell>
                </gx-table>`
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent.trim().replace(/\s/g, "")).toEqual('Cell1Cell2');
    });

    it('should overflow when auto-grow=false', async () => {
      element.autoGrow = false;
      element.columnsTemplate = "1fr 1fr";
      element.rowsTemplate = "200px";
      element.areasTemplate = `'${cell0} ${cell1}'`;
      element.style.height = "100px";
      await flush(element);
      expect(getComputedStyle(element).height).toEqual('100px');
    });

    it('should show two stacked cells', async () => {
      element.columnsTemplate = "1fr";
      element.rowsTemplate = "200px 200px";
      element.areasTemplate = `'${cell0}' '${cell1}'`;
      await flush(element);
      expect(getComputedStyle(element).height).toEqual('400px');
    });
  });
});
