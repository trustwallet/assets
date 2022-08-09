extern crate hex;
extern crate plot_icon;
extern crate serde_json;

mod models;

use models::{ActiveEra, ErasRewardPoints, TrustValidator, ValidatorCommission, ValidatorIdentity};
use plot_icon::plot_png_from_base58;
use std::fs::File;
use std::process::Command;
use std::thread;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let base_url = "https://us-dot1.binancechain.io";

    let active_era_url = format!("{}/pallets/staking/storage/activeEra", base_url);
    let active_era: ActiveEra = reqwest::get(active_era_url).await?.json().await?;
    println!("<== active era is: {:#?}", active_era.value.index);

    let reward_points_url = format!(
        "{}/pallets/staking/storage/erasRewardPoints?key1={}",
        base_url, active_era.value.index
    );
    let reward_points: ErasRewardPoints = reqwest::get(reward_points_url).await?.json().await?;
    println!("<== total points: {:#?}", reward_points.value.total);

    let mut results: Vec<TrustValidator> = vec![];
    let validators = reward_points.value.individual;
    for id in validators.keys() {

        let _err = ::serde_json::to_writer_pretty(&File::create("results.json")?, &results);

        let points = &validators[id];
        println!("<== validator {:#?} points: {:#?}", id, points);
        let url = format!(
            "{}/pallets/identity/storage/IdentityOf/?key1={}",
            base_url, id
        );
        println!("==> fetch identity");
        let identity: ValidatorIdentity = reqwest::get(url).await?.json().await?;

        if let Some(value) = identity.value {
            let display = decode_hex(&value.info.display.raw);
            let website = decode_hex(&value.info.web.raw);
            if display.len() == 0 || website.len() == 0 {
                println!("==> skip empty display or website");
                continue;
            }

            println!("==> decoded name: {:#?}", display);
            println!("==> decoded website: {:#?}", website);

            let commission_url = format!(
                "{}/pallets/staking/storage/validators?key1={}",
                base_url, id
            );

            println!("==> fetch commission");
            let commission: ValidatorCommission =
                reqwest::get(commission_url).await?.json().await?;

            println!("<== commission: {}", commission.value.commission);

            if commission.value.commission != "1000000000" {
                results.push(TrustValidator {
                    id: id.clone(),
                    name: display,
                    website: website,
                    description: "".to_string(),
                    commission: commission.value.commission,
                    points: points.clone()
                });
                println!("{:?}", Command::new("mkdir").arg("assets/".to_owned() + &id.to_owned()).output());
                let filename = "assets/".to_owned() + &id.to_owned() + "/logo.png";
                match plot_png_from_base58(id, 128, filename.as_str()) {
                    Ok(()) => (),
                    Err(e) => println!("Generate {} error. {}", filename, e),
                }
            }
        } else {
            thread::sleep(Duration::from_millis(1000));
        }
    }
    Ok(())
}

fn decode_hex(s: &Option<String>) -> String {
    if let Some(raw) = s {
        let bytes = hex::decode(raw.trim_start_matches("0x")).unwrap();
        let str = std::str::from_utf8(&bytes).unwrap_or("");
        return str.to_string();
    }
    return "".to_string();
}
