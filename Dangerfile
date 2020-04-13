require 'find'

# Failures

# Validate JSON content
Find.find('./blockchains') do |file|
  if File.extname(file) == '.json'
    if JSON.parse(File.open(file).read)
      fail("Wrong JSON content in: " + file)
    end
  end
end

# Warnings

## Mainly to encourage writing up some reasoning about the PR, rather than just leaving a title
if github.pr_body.length < 1
  fail "Please provide a summary in the Pull Request description"
end
