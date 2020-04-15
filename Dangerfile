require 'find'
require 'image_size'
require 'json-schema'

blockchains_folder = './blockchains'
allowed_extensions = ['png', 'json']
allowed_file_names = ['info', 'list', 'logo', 'whitelist', 'blacklist']

maxAssetLogoSizeInKilobyte = 100
minLogoWidth = 64
minLogoHeight = 64
maxLogoWidth = 512
maxLogoHeight = 512

# Failures
# Do not allow files in this directory
Dir.foreach(blockchains_folder) \
  .map { |x| File.expand_path("#{blockchains_folder}/#{x}") } \
  .select { |x| File.file?(x) }
  .map { |x| 
  fail("Not allowed to have files inside blockchains folder itself. You have to add them inside specific blockchain folder as blockchain/ethereum or blockchain/binance for file: " + x)
}

Find.find(blockchains_folder) do |file|
  file_extension = File.extname(file).delete('.')
  file_name = File.basename(file, File.extname(file))

  # Skip if directory
  if File.directory?(file)
    next
  end

  if !allowed_extensions.include? file_extension
    fail("Extension not allowed for file: " + file)
  end

  if !allowed_file_names.include? file_name
    fail("Filename not allowed for file: " + file)
  end

  # Validate JSON content
  if file_extension == 'json'
    value = nil
    begin
      value = JSON.parse(File.open(file).read)
    rescue JSON::ParserError, TypeError => e
      fail("Wrong JSON content in file: " + file)
    end

    # Validate info.json
    if file_name == 'info'
      schema = {
        "type": "object",
        "required": ["name", "website", "short_description", "explorer"],
        "properties": {
          "name": {"type": "string"},
          "website": {"type": "string"},
          "short_description": {"type": "string"},
          "explorer": {"type": "string"}
        }
      }
      errors = JSON::Validator.fully_validate(schema, value)
      errors.each { |error| message("#{error} in file #{file}") } 
    end

    # Validate list.json for validators
    if file_name == 'list'
      schema = {
        "type": "array",
        "items": {
          "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "description": { "type": "string" },
              "website": { "type": "string" }
          },
          "required": ["id", "name", "description", "website"]
        }
      }
      errors = JSON::Validator.fully_validate(schema, value)
      errors.each { |error| message("#{error} in file #{file}") } 
    end

    # Validate whitelist, blacklist files
    if file_name == 'whitelist' || file_name == 'blacklist'
      schema = {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
      errors = JSON::Validator.fully_validate(schema, value)
      errors.each { |error| message("#{error} in file #{file}") } 
    end
  
  end

  # Validate images
  if file_extension == 'png'
    image_size = ImageSize.path(file)

    if image_size.width > maxLogoWidth || image_size.height > maxLogoHeight
      fail("Image width or height is higher than 512px for file: " + file)
    end

    if image_size.format == 'png'
      fail("Image should be PNG for file: " + file)
    end

    # Make sure file size only 100kb
    if File.size(file).to_f / 1024 > maxAssetLogoSizeInKilobyte
      fail("Image should less than 100kb for file: " + file)
    end
  end
end