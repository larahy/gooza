export const buildPlacecast = ({
                          title = 'Twinings Tea Shop',
                          subtitle = 'The Twinings logo, a simple, gold sign bearing the company name, has remained unchanged since 1787.',
                          coordinates = [ -0.1128, 51.5133 ],
                          s3_audio_filename = 'twinings_tea.mp3',
                          s3_photo_filename = 'twinings_tea.jpeg',
                          published = true,
                          user_id = 1
                        } = {}) => {
  return {
    title,
    subtitle,
    coordinates,
    s3_audio_filename,
    s3_photo_filename,
    published,
    user_id
  }
}


export const buildUser = ({
                     first_name = 'Brenda',
                     last_name = 'Chan',
                     email = 'brenda@example.com',
                     password = 'brenda'
                   } = {}) => {
  return {
    first_name,
    last_name,
    email,
    password
  }
}