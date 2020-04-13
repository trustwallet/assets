require 'find'
require 'image_size'

assets_folder = './blockchains'
allowed_extensions = ['png', 'json']

# Failures

Find.find(assets_folder) do |file|
  file_extension = File.extname(file).delete('.')

  if allowed_extensions.include? file_extension == false
    fail("Extension not allowed for file: " + file)
  end

  # Validate JSON content
  if file_extension == 'json'
    begin
      JSON.parse(File.open(file).read)
    rescue JSON::ParserError, TypeError => e
      fail("Wrong JSON content in file: " + file)
    end
  end

  # Validate images
  if file_extension == '.png'
    image_size = ImageSize.path(file)

    if image_size.width > 512 || image_size.height > 512
      fail("Image width or height is higher than 512px for file: " + file)
    end

    if image_size.format == ':png'
      fail("Image should be PNG for file: " + file)
    end

    # Make sure file size only 100kb
    if File.size(file).to_f / 1024 > 100
      fail("Image should less than 100kb for file: " + file)
    end
  end
end

# Image Size

# Warnings

## Mainly to encourage writing up some reasoning about the PR, rather than just leaving a title
#if github.pr_body.length < 1
#  fail "Please provide a summary in the Pull Request description"
#end
