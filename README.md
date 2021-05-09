# File Outputs Action

Set outputs from multiple files.

## Inputs

### `files`

**Required** The files to set as outputs.

This is of the format: `name=path/to/file` where `name` is the name of the output of this action. Multiple can be set by using multiple lines.

Prefix the line with `!` to add a mask for the file contents (beware if this is a multi-line file as GitHub Actions doesn't support multiline masking, so we mask per line, so ensure each line is approproate to be masked. ie: not a short common string). By default 'utf8' encoding is used for reading the file, this can be changed by suffixing the line with `|<encoding>`, eg: `|utf16`.

## Example usage

```yaml
uses: edwardgeorge/file-outputs-action@main
with:
  files: |
    output1=foo.txt
    output2=bar.txt
```
