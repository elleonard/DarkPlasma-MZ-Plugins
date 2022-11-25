import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export default function applyTemplate(options = {}) {
  const template = ejs.compile(fs.readFileSync(options.template, 'utf-8'), {});
  return {
    name: 'applyTemplate',
    async renderChunk(code, chunk) {
      if (chunk.facadeModuleId) {
        const name = path.basename(chunk.facadeModuleId, '.js');
        const header = fs.readFileSync(path.resolve(chunk.facadeModuleId, '..', '_build', `${name}_header.js`), 'utf-8');

        code = removeTripleSlash(wrapperToLambda(code));

        return template({
          name,
          header,
          code,
        });
      } else {
        return removeTripleSlash(wrapperToLambda(code));
      }
    },
  };
}

/**
 * rollup.jsのiifeは (function() {}()); で固定
 * ラムダのほうが好きなので変換する
 * @param {string} code コード
 * @return {string}
 */
function wrapperToLambda (code) {
  return code.replace(/^\(function \(\) {/, '(() => {').replace(/}\(\)\);$/, '})();');
}

/**
 * トリプルスラッシュディレクティブを除去する
 * @param {string} code
 * @return {string}
 */
 function removeTripleSlash(code) {
  return code.replaceAll(/\/\/\/ <.*\/>\r??\n/gi, '');
}
